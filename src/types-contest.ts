import { FindingEmbMeta } from "./types-finding.js"
import { Document } from "text-splitter"

export const ALL_PLATFORMS = [
  "c4",
  "sherlock",
  "codehawks",
  "hats",
  "cantina",
  "immunefi",
  "hackenproof",
]

export type PlatformTuple = typeof ALL_PLATFORMS
export type Platform = PlatformTuple[number]

export const ALL_TAGS = [
  "none",
  "712",
  "721",
  "1967",
  "1155",
  "4626",
  "erc20",
  "nft",
  "bridge",
  "proxy",
  "l2",
  "domain_separator",
  "division",
  "initializ",
  "slippage",
  " amm ",
  "lend",
  "borrow",
  "swap",
  "stable",
  "curve",
  "token",
  "ecrecover",
  "foundry",
  "reentrancy",
  "flash loan",
  "weth",
  "fee on transfer",
]
export type TagTuple = typeof ALL_TAGS
export type Tag = TagTuple[number]

export type AnalyzeResult = {
  total_nloc: number
  // file extension
  modules: {
    [key: string]: ModuleTypeInfo
  }
}

export type ModuleTypeInfo = {
  count: number
  nloc: number
}

export type Contest = {
  pk: string
  sk: string
  readme: string // where this information was parsed from
  url: string
  start_date: number
  end_date: number
  // = end_date > current_date (can be created but not running)
  active: number
  status: Status
  prize: string // could be eth or usd
  platform: Platform
  tags: Tag[]
  repo_urls?: string[]
  doc_urls?: string[]
  em_stored?: number // embeddings stored
  cl_stored?: number // checklist stored
  fl_stored?: number // in scope files stored
  analyze_result?: AnalyzeResult
}

export type Status = "created" | "active" | "judging" | "finished"

export type ContestEmbeddings = {
  pk: string
  sk: string
  emb_q: string
  chat_q: string
  k: number
  emb_res: Document[] // string[]
  chat_res: string
}

export type ContestWithModules = Contest & {
  modules: ContestModule[] // all files
  audit_time?: number
  loc?: number
}

// could be different contracts or combination of contracts. Also frontend/backend
export type ContestModule = {
  name: string
  contest: string
  active: number
  url?: string
  path?: string
  loc?: number
}

export type FindingDocument = Document & {
  metadata: FindingEmbMeta
}
