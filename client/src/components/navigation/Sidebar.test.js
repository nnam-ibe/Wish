import React from 'react';
import { render } from '@testing-library/react'

import Sidebar from './Sidebar';

const props = {
	location: {
		pathname: '/lists/ListItem1'
	},
	userPrefs: {
		activeLists: ['ListItem1', 'ListItem2', 'ListItem3']
	}
};

describe('Sidebar', () => {
	it('new list button appears', () => {
		const { getByText } = render(<Sidebar {...props}/>);
		expect(getByText('New List'));
	});

	it('list items appear', () => {
		const { getByText } = render(<Sidebar {...props}/>);
		expect(getByText('ListItem1'));
		expect(getByText('ListItem2'));
		expect(getByText('ListItem3'));
	});

	it('Delete button does not show up when not in /settings', () => {
		const { queryByTestId } = render(<Sidebar {...props}/>);
		const deleteButton = queryByTestId('sidebar-delete-button');
		expect(deleteButton).toBeNull();
	});

	it('Delete button shows up for each item when in /settings', () => {
		const noEditProps = {...props, ...{ location: { pathname: '/settings' }}};
		const { getAllByTestId } = render(<Sidebar {...noEditProps}/>);
		expect(getAllByTestId('sidebar-delete-button')).toHaveLength(3);
	});
});