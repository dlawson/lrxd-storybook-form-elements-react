import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Dropdown from '../components/Dropdown';

export const data = {
  id: 1,
  formId: 2,
  isOpen: true,
  cssClass: 'test-class',
  placeholder: 'Please choose one',
  value: '',
  choices: [
    { text: "I'd like to hire LRXD", value: "I'd like to hire LRXD" }, 
    { text: "I'd like to work for LRXD", value: "I'd like to work for LRXD" }, 
    { text: "I'd like to partner with LRXD", value: "I'd like to partner with LRXD" }, 
    { text: "I have general questions", value: "I have general questions" }
  ]
};

export const actions = {
  onPinTask: action('onPinTask'),
  onArchiveTask: action('onArchiveTask')
};

storiesOf('Dropdown', module)
  .add('Default', () => <Dropdown data={data} />)
  .add('Dark', () => <Dropdown data={data} theme="dark" />); 