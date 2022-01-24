import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import customStyles from './helpers/custom-styles'

import ResultObject from './result-object';
import IconComponent from './icon-component';
import PaginationControls from './pagination-controls';


const GeneralResults = (
	{
		results,
		totalResults,
		showOnlyOptions,
		showOnly,
		topRef,
		scrollToRef,
		handleShowOnlyChange,
		handleFacetChange,
		handleSearchQueryChange,
		handlePaginationChange,
		handlePerPageChange,
		pageSizeOptions,
		sortByFields,
		offset,
		facets,
		perPage,
		sortBy
	}
) => {
	return (
		<section className="cs__body">
			<section className="cs__show-only">
				<span className="cs__section-title">Show Only:</span>
				<ul className="cs__show-wrapper">
					{showOnlyOptions.map(option => {
						return (
							<li key={option.value} className="cs__show-option">
								<input
									checked={Object.keys(showOnly).includes(option.value)}
									name={option.value}
									onChange={handleShowOnlyChange}
									type="checkbox"
									id={option.value}
								/>
								<label htmlFor={option.value}>
									{option.name}
								</label>
								{option.icon && <IconComponent icon={option.icon} text={option.iconText}/>}
							</li>
						)
					})}
				</ul>
			</section>
			<section className="cs__facets">
				<span className="cs__section-title">Filter By:</span>
				<div className="cs__facet-wrapper">
					{facets.map(facet => {
						return (
							<div
								key={facet.id}
								className="cs__facet-container">
								<label
									className="cs__facet-label screen-reader-only"
									htmlFor={facet.id}>
									{facet.label}
								</label>
								<Select
									styles={customStyles}
									defaultValue={facet.selectedValues}
									className="cs__facet"
									isMulti
									isSearchable="true"
									inputId={facet.id}
									name={facet.id}
									placeholder={facet.label}
									onChange={e => handleFacetChange(e,facet)}
									options={facet.options}
								/>
							</div>
						);
					})}
				</div>
			</section>
			<section className="cs__sort-results">
				<div className="cs__total-results">
					Showing {totalResults > 20000 ? "tens of thousands of" : totalResults.toLocaleString()} results
				</div>
				<div className="cs__sort-control">
					<span className="cs__section-title">Sort By:</span>
					<div className="cs-select__wrapper">
						<select
							className="cs-select"
							name="sort-by"
							id="sort-by"
							value={sortBy}
							onChange={event => handleSearchQueryChange("sortBy", event)}>
							{sortByFields.map(sortBy => {
								return (
									<option key={sortBy.value} value={sortBy.value}>
										{sortBy.name}
									</option>
								)
							})}
						</select>
					</div>
				</div>
			</section>
			{results.length > 0 ? (
				<section className="cs__results">
					{results.map((collectionItem,i) => {
						return (
							<ResultObject
								key={collectionItem.accessionNumber || `dummyItem-${i}`}
								collectionItem={collectionItem}
							/>
						);
					})}
				</section>) :
				(<section className="cs__no-results">
					There are no results found. Please try another search.
				</section>)
			}
			<section className="cs__pagination">
				<PaginationControls
					offset={offset}
					handlePaginationChange={handlePaginationChange}
					perPage={perPage}
					totalResults={totalResults}
				/>
				<div className="cs__rpp">
					<span>Results per page:</span>
					{pageSizeOptions.map(value => {
						return (
							<button
								disabled={perPage === value}
								value={value}
								onKeyDown={event => event.key === 'Enter' && handlePerPageChange(event)}
								onClick={event => handlePerPageChange(event)}
								key={value}
								className="rpp__option">
								{value}
							</button>
						)
					})}
				</div>
				<div className="rtt__wrapper">
					<button
						onKeyDown={event => event.key === 'Enter' && scrollToRef(topRef)}
						onClick={() => scrollToRef(topRef)}
						className="cs__rtt-button">
						Return To Top
					</button>
				</div>
			</section>
		</section>
	)
}

GeneralResults.propTypes = {
	results: PropTypes.number,
	totalResults: PropTypes.number,
	showOnlyOptions: PropTypes.array,
	showOnly: PropTypes.string,
	handleShowOnlyChange: PropTypes.func,
	handleFacetChange: PropTypes.func,
	handleScrollToRef: PropTypes.func,
	handleSearchQueryChange: PropTypes.func,
	handlePaginationChange: PropTypes.func,
	handlePerPageChange: PropTypes.func,
	scrollToRef: PropTypes.func,
	pageSizeOptions: PropTypes.array,
	sortByFields: PropTypes.array,
	offset: PropTypes.number,
	facets: PropTypes.array,
	perPage: PropTypes.number,
	sortBy: PropTypes.string,
	topRef: PropTypes.string //TODO: Probably not a string
}

export default GeneralResults