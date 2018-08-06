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
const colorLight = '#ffffff';
const colorDark = '#222222';

const Element = styled.div `
  border-bottom: ${borderWidth}px solid;
  position: relative;
  border-color: ${colorDark};
  > * {
    background: ${colorLight};
    color: ${colorDark};
  }
  &.dark {
    border-color: ${colorLight};
    * {
      background: ${colorDark};
      color: ${colorLight};
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
    cursor: pointer;
    display: block;
    overflow: hidden;
    padding: ${selectListPaddingUnit}px;
    padding-right: 1em;
    position: relative;
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
`;

export default class Dropdown extends React.Component {
  constructor(props) {
    super(props);

    const data = props.data;
    this.maybeAddPlaceholder(data);
    this.state = {
      data: props.data,
      isOpen: false,
      theme: props.hasOwnProperty('theme') ? props.theme : 'light'
    }
  }
  maybeAddPlaceholder = (data) => {
    const placeholderKey = 'placeholder';
    const hasPlaceholderAlready = (data.choices.filter(choice => choice.hasOwnProperty('isPlaceholder')).length);
    if (!hasPlaceholderAlready && data.hasOwnProperty(placeholderKey) && data[placeholderKey]) {
      data.choices.unshift({
        text: data[placeholderKey],
        value: '',
        isPlaceholder: true
      });
    }
  }
  componentDidMount = () => {
    this.sel.addEventListener('change', this.onElementChange);
  }
  onElementChange = (e) => {
    const data = this.state.data;
    data.value = this.sel.value;
    this.setState({ data });
  }
  onToggle = (e) => {
    e.preventDefault();
    if (!this.state.isOpen) {
      this.sel.focus();
    } else {
      this.sel.blur();
    }
  }
  onElementFocus = (e) => {
    this.setState({ isOpen: true });
  }
  onElementBlur = (e) => {
    this.setState({ isOpen: false });
  }
  onItemSelect = (e) => {
    this.sel.value = e.target.dataset.value;
    this.sel.dispatchEvent(new Event('change'));
  }
  getItemClasses = (itemData, selectedValue) => {
    const itemClasses = [];
    if (itemData.value == selectedValue) itemClasses.push('selected');
    if (itemData.hasOwnProperty('isPlaceholder') && itemData.isPlaceholder) itemClasses.push('disabled placeholder');

    return itemClasses.join(' ');
  }
  getSelectedChoice = (choices) => {
    // Get Selected Value or first item in Choices List
    const data = this.props.data;

    const displayChoiceRaw = choices.filter((choice) => {
      return choice.value == data.value;
    });


    let displayChoice;
    if (displayChoiceRaw.length) {
      displayChoice = displayChoiceRaw[0];
    } else {
      choices[0].isSelected = true;
      displayChoice = choices[0];
    }

    return displayChoice;
  }

  
  render() {
    const {data, isOpen, theme} = this.state;
    const displayChoice = this.getSelectedChoice(data.choices);
    
    return (
      <Element className={[(isOpen) ? 'open' : '', theme].join(' ')}>
        <select ref={(sel) => this.sel = sel } value={displayChoice.value} onChange={this.onElementChange.bind(this)} onFocus={this.onElementFocus.bind(this)} onBlur={this.onElementBlur.bind(this)} > 
          { data.choices.map(choice => <option value={choice.value}>{choice.text}</option>) }
        </select>
        <a class="display" rel="display" onMouseDown={this.onToggle.bind(this)}>
          <div className="text">{displayChoice.text}</div>
          <div className="toggle"></div>
        </a>
        <ul rel="list">
          {data.choices.map(choice => <li key={choice.value} className={this.getItemClasses(choice, data.value)}><a data-value={choice.value} onMouseDown={this.onItemSelect.bind(this)}>{choice.text}</a></li>) }
        </ul>
      </Element>
    );  
  }
}