import React, { useState, useEffect } from 'react';
import SearchBar from './components/search-bar';
import ResultObject from './components/result-object';
import './app.scss';

const searchAPI = 'https://www.metmuseum.org/api/search?';

const placeholderResult = {
	"url": "",
	dataFields: [],
	"image": "https://www.metmuseum.org/assets/icons/ico-no-image.svg",
	"artist": "",
	"data": ""
}

let abortController = null;

const initialUrl = new URL(`${window.location}`);
const inititalParams = new URLSearchParams(initialUrl.search.slice(1));
const initalPramsString = inititalParams.toString();
const initialQuery = inititalParams.get("q") || "";
const initialSelectedOption = inititalParams.get("searchFacet") || "All Results";
const initialOffset = inititalParams.get("offset") || 0;

const App = () => {
	const [isSearching, setIsSearching] = useState(false);

	const [searchParamsString, setSearchParamsString] = useState(initalPramsString);
	const [query, setQuery] = useState(initialQuery);
	const [prevQuery, setPrevQuery] = useState(null);
	const [selectedOption, setSelectedOption] = useState(initialSelectedOption);
	const [offset, setOffset] = useState(initialOffset);

	const [facet, setFacet] = useState({values: []});
	const [totalResults, setTotalResults] = useState(0);
	const [results, setResults] = useState(Array(10).fill(placeholderResult));

	const [darkMode, setDarkMode] = useState(false);

	const topRef = React.createRef();

	const findSelectedFacet = facet => {
		const selectedOption = facet.values.find(option => option.selected);
		setSelectedOption(selectedOption.id || "All Results");
	};

	const callAPI = async () => {
		setIsSearching(true);
		
		abortController && abortController.abort();
		abortController = new AbortController();
	
		const request = await fetch(`${searchAPI}${searchParamsString}`, { signal: abortController.signal });
		const response = await request.json();
		if (response.results) {
			setResults(response.results);

			if (prevQuery !== query) {
				setPrevQuery(query);
				setFacet(response.facets[0]);
			}
			findSelectedFacet(response.facets[0]);
			setTotalResults(response.totalResults);
		} else {
			console.log("No Results");
			setResults([]);
			setTotalResults(0);
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

		paramsObject.set("offset", 0);
		setOffset(0);
		
		setSearchParamsString(paramsObject.toString());
	};

	const handleSelectedOptionChange = event =>{
		setSelectedOption(event.target.value);
		const paramsObject = new URLSearchParams(searchParamsString);
		paramsObject.set("searchFacet", event.target.value);

		paramsObject.set("offset", 0);
		setOffset(0);
		
		setSearchParamsString(paramsObject.toString());
	}

	const scrollToRef = ref => {
		ref.current.scrollIntoView({
			block: 'start',
			behavior: 'smooth'
		});
	};

	const updateURL = () => {
		const params = new URLSearchParams(searchParamsString);
		params["offset"] === "0" && params.delete("offset");
		[...params.entries()].forEach(([key, value]) => {
			if (key === "offset" && value === "0") {
				params.delete(key);
			}
			if (!value) {
				params.delete(key);
			}
		});
		window.history.replaceState({}, '', `${location.pathname}?${params}`);
	};

	useEffect(() => {
		setDarkMode(inititalParams.get("darkmode"));
	}, []);

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
			offset={offset}
			ref={topRef}
			className={mainClasses()}>
			<h1 className="gs__title">Search / {selectedOption}</h1>
			<h2 className="gs__sub-title">{query && totalResults ? `${totalResults.toLocaleString()} results for ${query}` : ""}</h2>
			<SearchBar
				query={query}
				onChange={handleSearchQueryChange}
			/>
			<section className="gs__facets">
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
			</section>
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
				<div className="rtt__wrapper">
					<button
						onKeyDown={event => event.key === 'Enter' && scrollToRef(topRef)}
						onClick={() => scrollToRef(topRef)}
						className="gs__rtt-button">
						Return To Top
					</button>
				</div>
			</section>
		</main>
	)
};

export default App;
