import { getForums } from "@common/disqusBackend"

export let forums: string[] = []

export async function loadingForums() {
    const fms = await getForums()
    forums = fms
}

