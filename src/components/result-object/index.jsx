import React from 'react';
import PropTypes from 'prop-types';

const ResultObject = ({result}) => {
	const isBestBet = result.bestBet ? (<span className="best-bet__title">Best Bet</span>) : "";
	const isPast = result.status === "Past Exhibition" ? "past-exhibition" : "";
	const teaser = (result.teaser && result.teaser.length > 400) ? result.teaser.substring(0, 400) + `...` : result.teaser;
	
	const imageURL= result.image ?
		result.image.includes("http") ?
			result.image :
			`https://metmuseum.org${result.image}` :
		`https://www.metmuseum.org/assets/icons/ico-no-image.svg`;

	const url = result.url.includes("http") ?
		result.url :
		`https://metmuseum.org${result.url}`;

	const cardText = (
		<div className='gs-result__result-teaser'dangerouslySetInnerHTML={{__html: teaser}}/>
	);

	const dataFieldText = (
		<div className='gs-result__data-container'>
			{result.dataFields.map(data => {
				return (
					<div className="gs-result__data" key={`data-${data.name}`}>
						<span className="gs-result__data-title">{data.name}:</span>
						<span
							className="gs-result__data-value"
							dangerouslySetInnerHTML={{__html: data.value}}
						/>
					</div>
				)
			})}
		</div>
	);
	
	return (
		<a
			className={`gs-result ${result.buttonText} ${isPast} ${result.bestBet && `best-bet`}`}
			href={url}>
			<div
				className="gs-result__image-wrapper">
				<img
					src={imageURL}
					alt={`Image for ${result.title}`}
					onError={({ currentTarget }) => {
						currentTarget.onerror = null; // prevents looping
						currentTarget.alt="Error";
						currentTarget.src="https://www.metmuseum.org/assets/icons/ico-no-image.svg";
					}}
					className="gs-result__image"
				/>
			</div>
			<div className="gs-result__body">
				<div className="gs-result__titles">
					<div className='gs-result__descriptor'>
						{isBestBet} {result.status ? result.status : result.buttonText}
					</div>
					<span
						className='gs-result__result-title'
						dangerouslySetInnerHTML={{__html: result.title}}
					/>
					{result.dates && <div className="gs-results__dates" dangerouslySetInnerHTML={{__html: result.dates}}/>}
				</div>
				{ result.dataFields.length > 0 && dataFieldText }
				{result.buttonText !== "Artwork" && cardText }
			</div>
		</a>
	);
}

ResultObject.propTypes = {
	result: PropTypes.object,
};

export default ResultObject;
