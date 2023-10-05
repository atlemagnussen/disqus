import { SearchRequest } from "./types"

export interface SavedSearchRequest extends SearchRequest {
    name: string
}