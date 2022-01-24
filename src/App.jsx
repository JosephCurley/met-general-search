import React, { useState, useEffect } from 'react';
import SearchBar from './components/search-bar';
import ResultObject from './components/result-object';
import './app.scss';

const searchAPI = 'https://www.metmuseum.org/api/search?';

const placeholderResult = {
	url: "",
	dataFields: [],
	image: "https://www.metmuseum.org/assets/icons/ico-no-image.svg",
	teaser: "",
	data: ""
};

const placeholderFacet = {
	values: []
};

const defaultSelectedOption = "All Results";

let abortController = null;

//Read Params From URL;
const initialUrl = new URL(`${window.location}`);
const inititalParams = new URLSearchParams(initialUrl.search.slice(1));

//Only allow visitors to leand on page 1.
inititalParams.set("page", 1);

// Store initial values to be passed to state
const initalPramsString = inititalParams.toString();
const initialQuery = inititalParams.get("q") || "";
const initialSelectedOption = inititalParams.get("searchFacet") || defaultSelectedOption;
const isDarkMode = inititalParams.get("darkmode") || false;

const App = () => {
	const [isSearching, setIsSearching] = useState(false);

	const [searchParamsString, setSearchParamsString] = useState(initalPramsString);
	const [query, setQuery] = useState(initialQuery);
	const [prevQuery, setPrevQuery] = useState(null);
	const [selectedOption, setSelectedOption] = useState(initialSelectedOption);
	const [page, setPage] = useState(1);

	const [facet, setFacet] = useState(placeholderFacet);
	const [totalResults, setTotalResults] = useState(0);
	const [results, setResults] = useState(Array(10).fill(placeholderResult));
	const [darkMode] = useState(isDarkMode);

	const handleResults = responseData => {
		if (page === 1) {
			setResults(responseData.results);
			//Facets and Total Results shouldnt change when changing facet or page.
			if (prevQuery !== query) {
				//Order Facets by result count
				responseData.facets[0].values.sort((a, b) => b.count - a.count);
				setFacet(responseData.facets[0]);
				setTotalResults(responseData.totalResults);
				setPrevQuery(query);
			}
			setSelectedOption(responseData.request.searchFacet || defaultSelectedOption);
		} else {
			//For Pages beyond the first, concat them with previously fetched pages.
			const oldResults = results;
			setResults(oldResults.concat(responseData.results));
		}
		
	};
	const callAPI = async () => {
		setIsSearching(true);
		
		abortController && abortController.abort();
		abortController = new AbortController();
	
		const request = await fetch(`${searchAPI}${searchParamsString}`, { signal: abortController.signal });
		const response = await request.json();

		if (response.results) {
			handleResults(response);
		} else {
			console.log("No Results");
			setResults([]);
			setTotalResults(0);
			setFacet(placeholderFacet);
		}
	};

	const searchCollection = async () => {
		try {
			await callAPI();
		} catch (e) {
			console.error(e);
		} finally {
			abortController = null;
			setIsSearching(false);
		}
	}

	const handleSearchQueryChange = event => {
		setQuery(event.target.value);

		const paramsObject = new URLSearchParams(searchParamsString);
		paramsObject.set("q", event.target.value);

		setPage(1);
		paramsObject.set("page", 1);
		setSearchParamsString(paramsObject.toString());
	};

	const handleSelectedOptionChange = event =>{
		setSelectedOption(event.target.value);
		const paramsObject = new URLSearchParams(searchParamsString);
		paramsObject.set("searchFacet", event.target.value);

		setPage(1);
		paramsObject.set("page", 1);
		setSearchParamsString(paramsObject.toString());
	};

	const handleShowMoreResults = () => {
		const newPage = page + 1;
		setPage(newPage);

		const paramsObject = new URLSearchParams(searchParamsString);
		paramsObject.set("page", newPage);
		setSearchParamsString(paramsObject.toString());
	};

	const showNotificationBanner = () => {
		if (selectedOption === "Events" ||selectedOption === "Art") {
			const link = selectedOption === "Events" ?
				(<a
					title={`Search for events ${query && `related to ${query}`}`}
					href={`https://metmuseum.org/events/whats-on?searchText=${query}`}>
					Advanced Event Search
				</a>) :
				(<a
					title={`Search our collection ${query && `for ${query}`}`}
					href={`https://met-collection-search.vercel.app/?q=${query}`}>
					Advanced Collection Search
				</a>);
			return (
				<section className="gs__notification">
					Need to refine your search? Use our {link} for more options and filters.
				</section>
			);
		} else {
			return <section className="gs__notification"/>
		}
	};
	const updateURL = () => {
		const params = new URLSearchParams(searchParamsString);
		//Page isn't useful for the user to ever see in their URL.
		params.delete("page");
		params.get("searchFacet") === defaultSelectedOption && params.delete("searchFacet");
		params.get("q") === "" && params.delete("q");
		window.history.replaceState({}, '', `${location.pathname}?${params}`);
	};

	useEffect(() => {
		searchCollection();
		updateURL();
	}, [searchParamsString]);

	const mainClasses = () => {
		const classArry = ["general-search",
			darkMode ? "darkmode" : "",
			isSearching ? "is-searching" : ""];
		return classArry.join(" ");
	}

	return (
		<main
			className={mainClasses()}>
			<h1 className="gs__title">Search / {selectedOption}</h1>
			<h2 className="gs__sub-title">{query && totalResults ? `${totalResults.toLocaleString()} results for ${query}` : ""}</h2>
			<SearchBar
				query={query}
				selectedOption={selectedOption}
				onChange={handleSearchQueryChange}
			/>
			<section className="gs__facets">
				<div className="gs__facets-wrapper">
					{facet.values.map(value => {
						if (value.id === ""){
							return;
						}
						return (
							<button
								key={value.id}
								className="gs__facet"
								disabled={selectedOption === value.id}
								value={value.id}
								onKeyDown={event => event.key === 'Enter' && handleSelectedOptionChange(event)}
								onClick={handleSelectedOptionChange}>
								{value.label} ({value.count.toLocaleString()})
							</button>
						)
					})}
				</div>
			</section>
			{showNotificationBanner()}
			{results.length > 0 ? (
				<section className="gs__results">
					{results.map((result,i) => {
						return (
							<ResultObject
								key={`result-${i}`}
								result={result}
							/>
						);
					})}
				</section>) :
				(<section className="gs__no-results">
					There are no results found. Please try another search.
				</section>)
			}
			<section className="gs__pagination">
				{totalResults > page * 10 &&
				(<button
					onKeyDown={event => event.key === 'Enter' && handleShowMoreResults()}
					onClick={handleShowMoreResults}
					className="gs__load-button">
					Show More
				</button>)}
			</section>
		</main>
	)
};

export default App;
