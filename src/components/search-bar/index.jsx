import React from 'react';
import PropTypes from 'prop-types';
import { DebounceInput } from 'react-debounce-input';


const SearchBar = ({onChange, query}) => {
	let placeholderText = "Search";

	return (
		<section className="gs__search">
			<DebounceInput
				className="object-search__input"
				key="objectSearchBar"
				placeholder={placeholderText}
				debounceTimeout={400}
				type="search"
				value={query}
				onChange={onChange}
			/>
		</section>
	)
};

SearchBar.propTypes = {
	query: PropTypes.string,
	onChange: PropTypes.func
}

export default SearchBar
