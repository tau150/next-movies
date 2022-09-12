import type {Movies} from "./types"

export const basicFetch = async <ReturnType>(endpoint: string): Promise<ReturnType> => {

  const response = await fetch(endpoint)

  if(!response.ok) throw new Error("Error!")

  const data = await response.json()

  return data
}

export const fetchMovies = async ( search = "", page = 1): Promise<Movies> => {
  return await basicFetch<Movies>(`/api/movies?search=${search}&page=${page}`)
}