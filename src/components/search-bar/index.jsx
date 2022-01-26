import React from 'react';
import PropTypes from 'prop-types';
import { DebounceInput } from 'react-debounce-input';


const SearchBar = ({onChange, query, selectedOption}) => {
	return (
		<section className="gs__search">
			<DebounceInput
				className="object-search__input"
				key="objectSearchBar"
				placeholder={`Search ${selectedOption}`}
				debounceTimeout={400}
				onKeyDown={event => event.key === 'Enter' && document.activeElement.blur()}
				type="search"
				value={query}
				onChange={onChange}
			/>
		</section>
	)
};

SearchBar.propTypes = {
	selectedOption: PropTypes.string,
	query: PropTypes.string,
	onChange: PropTypes.func
}

export default SearchBar
