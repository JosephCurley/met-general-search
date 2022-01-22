import React from 'react';
import PropTypes from 'prop-types';

const ResultObject = ({result}) => {

	return (
		<a
			className="gs__result"
			href={result.url}>
			<span className='gs__result-title'dangerouslySetInnerHTML={{__html: result.title}}/>
		</a>
	)};

ResultObject.propTypes = {
	result: PropTypes.object,
};

export default ResultObject;
