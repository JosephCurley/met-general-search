import React from 'react';
import PropTypes from 'prop-types';
import { DebounceInput } from 'react-debounce-input';


const SearchBar = ({onChange, query, selectedOption}) => {
	return (
		<DebounceInput
			className="object-search__input"
			key="objectSearchBar"
			placeholder={`Search ${selectedOption}`}
			debounceTimeout={400}
			type="search"
			value={query}
			onChange={onChange}
		/>
	)
};

SearchBar.propTypes = {
	selectedOption: PropTypes.string,
	query: PropTypes.string,
	onChange: PropTypes.func
}

export default SearchBar
