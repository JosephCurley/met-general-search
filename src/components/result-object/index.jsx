import React from 'react';
import PropTypes from 'prop-types';

const ResultObject = ({result}) => {
	const imageURL= result.image.includes("metmuseum.org") ?
		result.image :
		`https://metmuseum.org${result.image}`;

	const url= result.url.includes("metmuseum.org") ?
		result.url :
		`https://metmuseum.org${result.url}`;

	const cardText = (
		<div className='gs-result__result-teaser'dangerouslySetInnerHTML={{__html: result.teaser}}/>
	);

	const isPast = result.status === "Past Exhibition" ? "past-exhibition" : "";
	const eventCardText = (
		<div className='gs-result__event-result'>
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
			className={`gs-result ${result.buttonText} ${isPast}`}
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
					<div className='gs-result__descriptor'>{result.status ? result.status : result.buttonText} </div>
					<span
						className='gs-result__result-title'
						dangerouslySetInnerHTML={{__html: result.title}}
					/>
					{result.dates && <div className="gs-results__dates" dangerouslySetInnerHTML={{__html: result.dates}}/>}
				</div>
				{ result.dataFields.length > 0 ? eventCardText : cardText }
			</div>
		</a>
	);
}

ResultObject.propTypes = {
	result: PropTypes.object,
};

export default ResultObject;
