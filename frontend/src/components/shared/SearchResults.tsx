import { Models } from 'appwrite'
import Loader from './loader'
import GridPostList from './GridPostList'

type SearchResultsProps = {
  isSearchFetching: boolean
  searchedPosts: Models.Document[]
}

function SearchResults({isSearchFetching , searchedPosts} : SearchResultsProps) {
  if(isSearchFetching) return <Loader/>
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
  if(searchedPosts && searchedPosts.documents.length > 0) return <GridPostList posts = {searchedPosts.documents}/>
  return (
    <p className='text-light-4 mt-10 text-center w-full'>No Results Found</p>
  )
}

export default SearchResults