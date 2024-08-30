import GridPostList from "@/components/shared/GridPostList";
import SearchResults from "@/components/shared/SearchResults";
import Loader from "@/components/shared/loader";
import { Input } from "@/components/ui/input";
import { useGetRecentPosts } from "@/lib/react-query/queriesAndMutation";
import { useState } from "react";

const FilterBox = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setTimeout(() => { setIsOpen(false) }, 1000);
  };

  return (
    <div className="relative inline-block" onClick={toggleDropdown}>
      <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
        <p className="text-sm md:text-base text-gray-300">All</p>
        <img src="/assets/icons/filter.svg" width={20} height={20} alt="filter" />
      </div>
      <div className="-ml-3.5">
        {isOpen && (
          <div className="absolute z-10 w-28 mt-4 bg-dark-3 shadow-lg rounded">
            <a href="#" className="block px-4 py-2 text-light-1 hover:bg-primary-500">By Name</a>
            <a href="#" className="block px-4 py-2 text-light-1 hover:bg-primary-500">By Date</a>
          </div>
        )}
      </div>
    </div>
  );
};

const Explore = () => {
  const [searchValue, setSearchValue] = useState("");
  const { data: recentPosts, isLoading: isLoadingPosts } = useGetRecentPosts();

  const shouldShowSearchResults = searchValue !== "";
  const shouldShowPosts = !shouldShowSearchResults && recentPosts?.length === 0;

  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">Search Posts</h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img src="/assets/icons/search.svg" width={24} height={24} alt="search" />
          <Input
            type="text"
            placeholder="Search"
            className="explore-search"
            value={searchValue}
            onChange={(e) => {
              const { value } = e.target;
              setSearchValue(value);
            }}
          />
        </div>
      </div>
      <div className="flex-between w-full max-w-7xl mt-16 mb-7">
        <h3 className="body-bold md:h3-bold">Popular Today</h3>
        <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
          <FilterBox />
        </div>
      </div>
      <div className="flex flex-wrap gap-9 w-full max-w-7xl">
        {shouldShowSearchResults ? (
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          <SearchResults isSearchFetching={isSearchFetching} searchedPosts={searchedPosts} />
        ) : shouldShowPosts ? (
          <p className="text-light-4 mt-10 text-center w-full">End of posts</p>
        ) : (
          <GridPostList posts={recentPosts ?? []} />
        )}
      </div>
      {isLoadingPosts && !searchValue && (
        <div className="mt-10">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Explore;
