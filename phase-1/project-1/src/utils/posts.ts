import { POSTS } from "../posts/posts.service"

export const findPostIndex = (id: number) => POSTS.findIndex(post => post.id === id)