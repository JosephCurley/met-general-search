import React from 'react';
import PropTypes from 'prop-types';
import ResultObject from './result-object';

const GeneralResults = (
	{
		results,
		totalResults,
		page,
		handleShowMoreResults
	}
) => {
	return (
		<section className="gs__result-section">
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
		</section>
	)
}

GeneralResults.propTypes = {
	results: PropTypes.array,
	page: PropTypes.number,
	totalResults: PropTypes.number,
	handleShowMoreResults: PropTypes.func
}

export default GeneralResults