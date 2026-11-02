"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { creatorApi } from "@/lib/api"
import { errorMessage, UserFacingError } from "@/lib/errors"
import { notify } from "@/lib/toast"
import type {
  CreatorMe,
  CreatorSubmission,
  CreatorWithdrawal,
} from "@/types/api"

type Section = "me" | "submissions" | "withdrawals"
export interface CreatorData {
  me: CreatorMe
  submissions: CreatorSubmission[] | null
  withdrawals: CreatorWithdrawal[] | null
}
type Snapshot = Omit<CreatorData, "me"> & { me: CreatorMe | null }
type Errors = Partial<Record<Section, string>>

export function useCreatorData(enabled: boolean, withHistory = true) {
  const [snapshot, setSnapshot] = useState<Snapshot>({
    me: null,
    submissions: null,
    withdrawals: null,
  })
  const [errors, setErrors] = useState<Errors>({})
  const [loading, setLoading] = useState(false)
  const generation = useRef(Symbol())

  const load = useCallback(
    async (manual = false, section?: Section) => {
      if (!enabled) return
      const current = Symbol()
      generation.current = current
      setLoading(true)
      const selected = (value: Section) => !section || section === value
      try {
        const [me, submissions, withdrawals] = await Promise.all([
          selected("me") ? creatorApi.me() : null,
          withHistory && selected("submissions")
            ? creatorApi.submissions({ perPage: 50 })
            : null,
          withHistory && selected("withdrawals")
            ? creatorApi.withdrawals({ perPage: 50 })
            : null,
        ])
        if (current !== generation.current) return
        setSnapshot((previous) => ({
          me: me?.success ? me.data : previous.me,
          submissions: submissions?.success
            ? submissions.data
            : previous.submissions,
          withdrawals: withdrawals?.success
            ? withdrawals.data
            : previous.withdrawals,
        }))
        const failures: Errors = {}
        if (me && !me.success) failures.me = me.error.message
        if (submissions && !submissions.success)
          failures.submissions = submissions.error.message
        if (withdrawals && !withdrawals.success)
          failures.withdrawals = withdrawals.error.message
        setErrors((previous) => {
          const next = { ...previous }
          for (const key of ["me", "submissions", "withdrawals"] as const) {
            if (selected(key) && (key === "me" || withHistory)) {
              if (failures[key]) next[key] = failures[key]
              else delete next[key]
            }
          }
          return next
        })
        if (manual) {
          const failure = Object.values(failures)[0]
          if (failure) notify.error(new UserFacingError(failure))
          else notify.success("Data berhasil diperbarui.")
        }
      } catch (failure) {
        if (current !== generation.current) return
        setErrors((previous) => ({
          ...previous,
          [section ?? "me"]: errorMessage(failure),
        }))
        if (manual) notify.error(failure)
      } finally {
        if (current === generation.current) setLoading(false)
      }
    },
    [enabled, withHistory]
  )

  useEffect(() => {
    void load()
    return () => {
      generation.current = Symbol()
    }
  }, [load])

  return {
    data: snapshot.me
      ? ({ ...snapshot, me: snapshot.me } as CreatorData)
      : null,
    error: errors.me ?? null,
    sectionErrors: errors,
    loading,
    reload: () => {
      void load(true)
    },
    retrySection: (section: Section) => {
      void load(true, section)
    },
  }
}
