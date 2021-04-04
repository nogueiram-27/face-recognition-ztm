import React from 'react';

const Rank = ({ user, entries }) => {
	return(
		<div>
			<div className='white f3'>
				{user}{', your current rank is...'}
			</div>
			<div className='white f1'>
				{entries}
			</div>
		</div>
	)
}

export default Rank;