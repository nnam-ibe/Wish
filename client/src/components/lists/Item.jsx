import React, { Component } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
// import { db } from '../../utils/firebaseUtil.js';
import _ from 'lodash';

class Item extends Component {

	constructor(props) {
		super(props);
		let difference = this._calculateDifference(props.price, props.saved);
		let progress = this._calculateProgress(props.price, props.saved);

		let formattedSaved = this._getFormattedAmount(props.saved);
		let formattedDifference = this._getFormattedAmount(difference);
		let formattedPrice = this._getFormattedAmount(props.price);

		this.state = {
			name: props.name,
			increment: props.increment,
			saved: props.saved,
			difference: difference,
			price: props.price,
			formattedSaved: formattedSaved,
			formattedDifference: formattedDifference,
			formattedPrice: formattedPrice,
			progress: progress
		};

	}

	// componentDidUpdate(prevProps, prevState) {
	// 	let samePage = prevProps.match.params.page === this.props.match.params.page;
	// 	let sameProps = this.props.uid === prevProps.uid
	// 	if (samePage && sameProps) return;

	// 	this._getList(this.props.uid);
	// }

	render() {
		return (
			<div className='item-margin'>
				<Paper className='auth-paper'>
					<div>
						<Typography variant='title'>{this.state.name}</Typography>
					</div>
					<div>
						<Table>
							<TableBody>
								<TableRow>
									<TableCell>
										<IconButton onClick={this._decrementSaved}>
											<RemoveIcon/>
										</IconButton>
									</TableCell>
									<TableCell>
										<div>
											<Typography variant='caption'>Saved</Typography>
											<Typography variant='body2'>{`$${this.state.formattedSaved}`}</Typography>
										</div>
									</TableCell>
									<TableCell>
										<div>
											<Typography variant='caption'>Difference</Typography>
											<Typography variant='body2'>{`$${this.state.formattedDifference}`}</Typography>
										</div>
									</TableCell>
									<TableCell>
										<div>
											<Typography variant='caption'>Price</Typography>
											<Typography variant='body2'>{`$${this.state.formattedPrice}`}</Typography>
										</div>
									</TableCell>
									<TableCell>
										<IconButton onClick={this._incrementSaved}>
											<AddIcon/>
										</IconButton>
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</div>
				</Paper>
				<LinearProgress variant="determinate" value={this.state.progress} />
			</div>
		);
	}

	_calculateDifference = (price, saved) => {
		let result = price - saved;
		if (result < 0) result = 0;

		return result;
	}

	_calculateProgress = (price, saved) => {
		return _.clamp((saved/price), 0, 1) * 100;
	}

	_getFormattedAmount = (amount) => {
		return String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	_decrementSaved = () => {
		let saved = this.state.saved - this.state.increment;
		if (saved < 0) saved = 0;

		this._updateValues(this.state.price, saved);
	}
	_incrementSaved = () => {
		let saved = this.state.saved + this.state.increment;
		this._updateValues(this.state.price, saved);
	}

	_updateValues = (price, saved) => {
		let formattedSaved = this._getFormattedAmount(saved);
		let formattedPrice = this._getFormattedAmount(price);
		let progress = this._calculateProgress(price, saved);
		let difference = this._calculateDifference(price, saved);
		let formattedDifference = this._getFormattedAmount(difference);

		this.setState({
			price,
			saved,
			formattedPrice,
			formattedSaved,
			progress,
			difference,
			formattedDifference
		});
	}
}

export default Item;