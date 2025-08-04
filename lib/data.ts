import {fetchRecentPosts} from "@/lib/api";

export async function getRecentPosts() {
    const json = await fetchRecentPosts();
    console.log("DEBUG json:", Array.isArray(json.result));
    return json.result;
}