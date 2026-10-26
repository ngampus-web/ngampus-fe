"use client"

import { useEffect, useState } from "react"

import { creatorApi } from "@/lib/api"
import type {
  CreatorMe,
  CreatorSubmission,
  CreatorWithdrawal,
} from "@/types/api"

export interface CreatorData {
  me: CreatorMe
  submissions: CreatorSubmission[]
  withdrawals: CreatorWithdrawal[]
}

type State =
  | { key: number; data: CreatorData; error: null }
  | { key: number; data: null; error: string | null }

/** Dashboard data; `enabled` waits for the creator gate. */
export function useCreatorData(enabled: boolean, withHistory = true) {
  const [state, setState] = useState<State>({
    key: -1,
    data: null,
    error: null,
  })
  const [requestKey, setRequestKey] = useState(0)

  useEffect(() => {
    if (!enabled) return
    let cancelled = false
    void Promise.all([
      creatorApi.me(),
      withHistory ? creatorApi.submissions({ perPage: 50 }) : null,
      withHistory ? creatorApi.withdrawals({ perPage: 50 }) : null,
    ]).then(([me, submissions, withdrawals]) => {
      if (cancelled) return
      if (!me.success) {
        setState({ key: requestKey, data: null, error: me.error.message })
        return
      }
      setState({
        key: requestKey,
        error: null,
        data: {
          me: me.data,
          submissions: submissions?.success ? submissions.data : [],
          withdrawals: withdrawals?.success ? withdrawals.data : [],
        },
      })
    })
    return () => {
      cancelled = true
    }
  }, [enabled, withHistory, requestKey])

  const loading = enabled && state.key !== requestKey
  return {
    data: loading ? null : state.data,
    error: loading ? null : state.error,
    loading,
    reload: () => setRequestKey((k) => k + 1),
  }
}
