import React, { useState, useEffect } from 'react';
import SearchBar from './components/search-bar';
import './app.scss';

const searchAPI = 'https://www.metmuseum.org/api/search?';

const placeholderCollectionItem = {
	"url": "",
	"image": "https://www.metmuseum.org/content/img/placeholders/NoImageAvailableIcon.png",
	"artist": "",
	"data": ""
}

let abortController = null;

const initialUrl = new URL(`${window.location}`);
const inititalParams = new URLSearchParams(initialUrl.search.slice(1));

const App = () => {
	const [searchParamsString, setSearchParamsString] = useState("");
	const [isSearching, setIsSearching] = useState(false);

	const [query, setQuery] = useState("");
	const [prevQuery, setPrevQuery] = useState("");
	const [facet, setFacet] = useState({values: []});
	const [selectedOption, setSelectedOption] = useState("All Results");
	const [offset, setOffset] = useState(0);
	const [totalResults, setTotalResults] = useState(20001);

	const [results, setResults] = useState(Array(10).fill(placeholderCollectionItem));

	const [darkMode, setDarkMode] = useState(false);

	const topRef = React.createRef();

	const findSelectedFacet = facet => {
		const selectedOption = facet.values.find(option => option.selected);
		setSelectedOption(selectedOption.id);
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
		console.log(offset);
		setSelectedOption(event.target.value);
		console.log(event.target.value);
		const paramsObject = new URLSearchParams(searchParamsString);
		paramsObject.set("searchFacet", event.target.value);

		paramsObject.set("offset", 0);
		setOffset(0);
		
		setSearchParamsString(paramsObject.toString());
	}

	const setStateFromURLParams = params => {
		setQuery(params.get("q") || "");
		setSelectedOption(params.get("searchFacet") || "All Results");
		setOffset(parseInt(params.get("offset")) || 0);
	};

	const scrollToRef = ref => {
		ref.current.scrollIntoView({
			block: 'start',
			behavior: 'smooth'
		});
	};

	useEffect(() => {
		setDarkMode(inititalParams.get("darkmode"));
		setSearchParamsString(inititalParams.toString());
		setStateFromURLParams(inititalParams);
	}, []);

	useEffect(() => {
		const params = searchParamsString  ?
			new URLSearchParams(searchParamsString) :
			inititalParams;
		searchCollection();
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
	}, [searchParamsString]);

	const mainClasses = () => {
		const classArry = ["general-search",
			darkMode ? "darkmode" : "",
			isSearching ? "is-searching" : ""];
		return classArry.join(" ");
	}

	return (
		<main
			ref={topRef}
			className={mainClasses()}>
			<h1 className="gs__title">Search / {selectedOption}</h1>
			<h2 className="gs__sub-title">{query ? `${totalResults.toLocaleString()} results for ${query}` : ""}</h2>
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
						<div
							onChange={handleSelectedOptionChange}
							key={value.id}
							className="gs__facet-container">
							<input
								defaultChecked={selectedOption === value.id}
								type="radio"
								name={facet.name}
								id={value.id}
								value={value.id}
								className="gs__facet-input hidden-input"
							/>
							<label
								tabIndex={0}
								className="gs__facet-label"
								htmlFor={value.id}>
								{value.label} ({value.count.toLocaleString()})
							</label>
						</div>
					)
				})}
			</section>
			{results.length > 0 ? (
				<section className="gs__results">
					{results.map((resultObject,i) => {
						return (
							<a
								className="gs__result"
								key={`result-object-${i}`}
								href={resultObject.url}>

								<span className='gs__result-title'dangerouslySetInnerHTML={{__html: resultObject.title}}></span>
							</a>
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
