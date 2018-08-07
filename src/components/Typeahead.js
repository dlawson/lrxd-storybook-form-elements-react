import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

/*
  This Component is built around an actual select element.  It is built around
  the select's native .focus() and blur() events.
*/

// Styles
const selectListPaddingUnit = 3;
const transitionDuration = '.5s';
const borderWidth = 1;
const color = {
  light: '#ffffff',
  dark: '#222222',
  error: '#e55451'
}

const Element = styled.div `
  border-bottom: ${borderWidth}px solid;
  position: relative;
  border-color: ${color.dark};
  > * {
    background: ${color.light};
    color: ${color.dark};
  }
  &.dark {
    border-color: ${color.light};
    * {
      background: ${color.dark};
      color: ${color.light};
    }
  }
  > select {
    /* Visually Hidden */
    position: absolute;
    overflow: hidden;
    clip: rect(0 0 0 0);
    height: 1 px;
    width: 1 px;
    margin: -1 px;
    padding: 0;
    border: 0;
  }
  .display {
    border: 0;
    box-sizing: border-box;
    display: block;
    overflow: hidden;
    padding: ${selectListPaddingUnit}px;
    padding-right: 1em;
    position: relative;
    width: 100%;
    z-index: 10;
    .toggle {
      display: flex;
      justify-content: center;
      align-items: middle;
      height: 1em;
      width: 1em;
      padding: ${selectListPaddingUnit}px;
      position: absolute;
      top: 0;
      transition: transform ${transitionDuration};
      right: 0;
      &:before {
        content: "\\25be";
      }
    }
  }
  ul {
    bottom: ${-borderWidth}px;
    box-shadow: 0 3px 15px rgba(0, 0, 0, .5);
    margin: 0;
    opacity: 0;
    padding: ${selectListPaddingUnit}px 0;
    position: absolute;
    list-style-type: none;
    transition: transform ${transitionDuration}, opacity ${transitionDuration};
    transform: translateY(100%) scaleY(0);
    transform-origin: center top;
    width: 100%;
  }
  li {
    > a {
      cursor: pointer;
      display: block;
      padding: ${selectListPaddingUnit}px ${2*selectListPaddingUnit}px;
      &:hover {
        text-decoration: underline;
      }
    }
    &.placeholder a {
      opacity: .5;
      cursor: default;
      text-decoration: none;
    }
    &.selected {
      display: none;
    }
    &.no-match {
      display: none;
    }
  }
  &.open {
    .display .toggle {
      transform: scaleY(-1);
    }
    ul {
      transform: translateY(100%) scaleY(1);
      opacity: 1;
    }  
  }
  &.no-match {
    .display {
      background: ${color.error};
    }
    li.no-match {
      display: block;
    }
  }
  
`;

export default class Typeahead extends React.Component {
  constructor(props) {
    super(props);

    const data = props.data;
    data.filtered = data.choices;
    this.state = {
      data: props.data,
      hasMatch: true,
      isOpen: false,
      theme: props.hasOwnProperty('theme') ? props.theme : 'light'
    }
  }
  onElementKeyUp = (e) => {
    let {data, isOpen, hasMatch} = this.state;
    switch (e.keyCode) {
      case 9:
        e.preventDefault()
        break;
      default: 
        if (e.target.value) {
          isOpen = true;
          data.filtered = data.choices.filter(choice => choice.toLowerCase().includes(e.target.value.toLowerCase()));
          switch (data.filtered.length) {
            case 0:
              hasMatch = false;
              break;
            default: 
              hasMatch = true;
          }
        }
        else {
          isOpen = false;
        }
        this.setState({ data, isOpen, hasMatch });
    }
  }
  filterChoices = (term) => {
    
  }
  onElementKeyDown = (e) => {
    switch(e.keyCode) {
      case 9:
        e.preventDefault();
        this.maybeAutoComplete();
        break;
      default:
        return true;
    }
  }
  onItemSelect = (e) => {
    const { data } = this.state;
    this.el.value = e.target.dataset.value;
    this.setState({isOpen: false})
  }
  getItemClasses = (itemData, selectedValue) => {
    const itemClasses = [];
    if (itemData.value == selectedValue) itemClasses.push('selected');
    if (itemData.hasOwnProperty('isPlaceholder') && itemData.isPlaceholder) itemClasses.push('disabled placeholder');

    return itemClasses.join(' ');
  }
  maybeAutoComplete = () => {
    const { data } = this.state;
    if (data.filtered.length == 1) {
      this.el.value = data.filtered[0];
      this.setState({isOpen: false});
    }
  }
  formatChoice = (choice) => {
    return choice;
  }
  render() {
    const {data, isOpen, theme, hasMatch} = this.state;    
    return (
      <Element className={[(isOpen) ? 'open' : '', (hasMatch) ? '' : 'no-match', theme].join(' ')}>
        <input type="text" ref={(el) => this.el = el } className="display" results="display" placeholder={data.placeholder} onKeyUp={this.onElementKeyUp.bind(this)} onKeyDown={this.onElementKeyDown.bind(this)}/>
        <ul rel="list">
          <li class="no-match">There are no items</li>
          {data.filtered.map(choice => <li key={choice} className={this.getItemClasses(choice, data.value)}><a data-value={choice} onMouseDown={this.onItemSelect.bind(this)}>{this.formatChoice(choice)}</a></li>) }
        </ul>
      </Element>
    );  
  }
}