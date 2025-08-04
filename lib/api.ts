import { API_URL } from '@/src/config';


export async function fetchLoginInformation() {
    try {
        const response = await fetch(`${API_URL}/api/v1/admins/me`, {
            credentials: 'include'
        });
        const data = await response.json();
        if (data.isLoggedIn) {
            return { isLoggedIn: true, user: data };
        } else {
            return {isLoggedIn: false};
        }


    } catch (err) {
        console.error('에러 발생:', err);
    }
}

export async function fetchUpdatePost(postId: number, data: any) {
    try {
        const response = await fetch(`${API_URL}/api/v1/posts/${postId}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        } else {
            return { success: true, message: "게시물이 성공적으로 업데이트되었습니다." };
        }
    } catch (err) {
        console.error("게시글 수정 실패:", err);
        throw err;
    }
}

export async function fetchUpdateDraftPost(postId: number, data: any) {
    try {
        const response = await fetch(`${API_URL}/api/v1/drafts/${postId}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        } else {
            return { success: true, message: "게시물이 성공적으로 업데이트되었습니다." };
        }
    } catch (err) {
        console.error("게시글 수정 실패:", err);
        throw err;
    }
}

export async function fetchRecentPosts() {
    // 본문 제외 모든 정보가 필요함.
    // 최근 6개의 글만 가져오기
    try{
        const response = await fetch(`${API_URL}/api/v1/posts?limit=6&is_published=true`, {
            method: 'GET',
            credentials: 'include'
        })
        const json = await response.json();
        console.log(json);
        return json;
    }catch(err){
        console.error('게시글 불러오기 실패:', err);
        return [];
    }
}

export async function fetchCategoriesAndPostsCount() {
    try{
        const response = await fetch(`${API_URL}/api/v1/categories`, {
            method: 'GET',
            credentials: 'include'
        })
        const json = await response.json();
        return json.result;
    }catch(err){
        console.error('카테고리 불러오기 실패:', err);
        return [];
    }
    /**
     {
     “total_categories_count”: 4
     “categories”: [
     {
     “category_id”: 1,
     “category_name”: “개발”,
     “post_count”: 8
     },
     ]
     }
     */
}

export async function fetchPost({postId}: { postId: number }) {
    try{
        const response = await fetch(`${API_URL}/api/v1/posts`, {
            method: 'GET',
            credentials: 'include'
        })
        const json = await response.json();
        return json.result.find((post: any) => Number(post.postId) === Number(postId));
    }catch(err){
        console.error('게시글 불러오기 실패:', err);
        return [];
    }
}

export async function fetchDraft({postId}: { postId: number }) {
    try{
        const response = await fetch(`${API_URL}/api/v1/drafts`, {
            method: 'GET',
            credentials: 'include'
        })
        const json = await response.json();
        return json.result.find((post: any) => Number(post.postId) === Number(postId));
    }catch(err){
        console.error('임시 저장 게시글 불러오기 실패:', err);
        return [];
    }
}

export async function fetchAllPosts() {
    try{
        const response = await fetch(`${API_URL}/api/v1/posts?is_published=true`, {
            method: 'GET',
            credentials: 'include'
        })
        const json = await response.json();
        console.log(json.result);
        return json.result;
    }catch(err){
        console.error('게시글 불러오기 실패:', err);
        return [];
    }
}

export async function fetchAllDraftPosts() {
    try{
        const response = await fetch(`${API_URL}/api/v1/drafts`, {
            method: 'GET',
            credentials: 'include'
        })
        const json = await response.json();
        console.log(json.result);
        return json.result;
    }catch(err){
        console.error('게시글 불러오기 실패:', err);
        return [];
    }
}


export async function fetchCategoriesRecent() {
    try{
        const response = await fetch(`${API_URL}/api/v1/categories/recent`, {
            method: 'GET',
            credentials: 'include'
        })
        const json = await response.json();
        console.log(json.result);
        return json.result;
    }catch(err){
        console.error('게시글 불러오기 실패:', err);
        return [];
    }
    /*
    [
        {
		“category_id”: 1,
		“category_name”: “개발”,
“category_description”: “웹 개발, 프로그래밍 언어, 프레임워크 등… ”,
“post_count”: 8,
		“recent_post”: {
    “post_id”: 1,
			“title”: “React 18의 새로운 기능들 살펴보기”,
    “published_at”: 2025-22-23
    }
},
]
    */
}

export async function fetchAboutMe() {
    /*
    {
	“”about_me”: “안녕하세요~ 박성열입니다.”
}
     */
}

export async function fetchInterests() {
    /*
    [
	{
		“tech”: “React”,
		“level”: “중급”
	},
]
     */
}

export async function fetchHistories() {
    /*
    [
	{
		“title”: “백엔드 개발자”,
		“start_date”: 2022-05-22,
		“end_date”: null,
		“description”: “React, Next.js를 사용한 웹 애플리케이션 개발”
	},
]
     */
}

export async function fetchStatics() {
    /*
    {
	“total_post_count”: 28,
	“total_categories_count”: 4
}
     */
}

export async function fetchSavePost(data: any) {
    try{
        console.log(data);
        const response = await fetch(`${API_URL}/api/v1/posts`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        const json = await response.json();
        console.log(json.result);
        return json.result;
    }catch(err){
        console.error('게시글 저장 실패:', err);
        return [];
    }
}

export async function fetchSaveCategory(data: any) {
    try{
        console.log(data);
        const response = await fetch(`${API_URL}/api/v1/categories`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        const json = await response.json();
        console.log(json.result);
        return json.result;
    }catch(err){
        console.error('카테고리 저장 실패:', err);
        return [];
    }
}

export async function fetchSaveDraftPost(data: any) {
    try{
        console.log(data);
        const response = await fetch(`${API_URL}/api/v1/drafts`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        const json = await response.json();
        console.log(json.result);
        return json.result;
    }catch(err){
        console.error('게시글 저장 실패:', err);
        return [];
    }
}

export async function deletePost(postId: number) {
    try {
        const response = await fetch(`${API_URL}/api/v1/posts/${postId}`, {
            method: "DELETE",
            credentials: "include",
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        // DELETE 요청은 보통 응답 본문이 없거나 간단한 상태만 반환
        // 응답이 있다면 JSON으로 파싱, 없다면 성공 객체 반환
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
            const json = await response.json()
            return json
        } else {
            return { success: true, message: "게시물이 성공적으로 삭제되었습니다." }
        }
    } catch (err) {
        console.error("게시글 삭제 실패:", err)
        throw err
    }
}

export async function fetchPublishDraftPost(postId: number) {
    try{
        const response = await fetch(`${API_URL}/api/v1/drafts/${postId}/publish`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            }
        })
        const json = await response.json();
        console.log(json.result);
        return json.result;
    }catch(err){
        console.error('게시글 저장 실패:', err);
        return [];
    }
}

export async function fetchDeleteCategory(categoryId: number) {
    try {
        const response = await fetch(`${API_URL}/api/v1/categories/${categoryId}`, {
            method: "DELETE",
            credentials: "include",
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        // DELETE 요청은 보통 응답 본문이 없거나 간단한 상태만 반환
        // 응답이 있다면 JSON으로 파싱, 없다면 성공 객체 반환
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
            const json = await response.json()
            return json
        } else {
            return { success: true, message: "게시물이 성공적으로 삭제되었습니다." }
        }
    } catch (err) {
        console.error("게시글 삭제 실패:", err)
        throw err
    }
}


export async function fetchUpdateCategory(categoryId: number, data: any) {
    try {
        const response = await fetch(`${API_URL}/api/v1/categories/${categoryId}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        } else {
            return { success: true, message: "카테고리가 성공적으로 업데이트되었습니다." };
        }
    } catch (err) {
        console.error("카테고리 수정 실패:", err);
        throw err;
    }
}