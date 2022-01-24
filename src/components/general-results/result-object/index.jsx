import React from 'react';
import PropTypes from 'prop-types';

const ResultObject = ({result}) => {
	const isBestBet = result.bestBet ? (<span className="best-bet__title">Best Bet</span>) : "";

	//Truncate the teaser at 400 characters
	const maxTeaserLength = 400;
	const teaser = (result.teaser && result.teaser.length > maxTeaserLength) ?
		result.teaser.substring(0, maxTeaserLength) + `...` :
		result.teaser;
	
	//The API returns relative URLs, this can be mostly removed when this app is on a metmuseum domain.
	const imageURL= result.image ?
		result.image.includes("http") ?
			result.image :
			`https://metmuseum.org${result.image}` :
		`https://www.metmuseum.org/assets/icons/ico-no-image.svg`;

	//Same as above, relative urls, need to be on a "metmuseum" domain
	const url = result.url.includes("http") ?
		result.url :
		`https://metmuseum.org${result.url}`;

	//Teaser Text is useful for all cards except "Artwork" where its redundant with dataFields.
	const teaserText = (
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
	
	const classString = () => {
		let classString = `gs-result`;
		classString = result.buttonText ? classString.concat(` `, result.buttonText) : classString;
		classString = result.status === "Past Exhibition" ? classString.concat(` `, `past-exhibition`) : classString;
		classString = result.bestBet ? classString.concat(` `, `best-bet`) : classString;
		return classString;
	};
	
	return (
		<a
			className={classString()}
			href={url}>
			<div
				className="gs-result__image-wrapper">
				<img
					src={imageURL}
					alt={`Image for ${result.title}`}
					onError={({ currentTarget }) => {
						currentTarget.onerror = null;
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
				{result.buttonText !== "Artwork" && teaserText }
			</div>
		</a>
	);
}

ResultObject.propTypes = {
	result: PropTypes.object,
};

export default ResultObject;
