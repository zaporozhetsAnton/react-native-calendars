import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import XDate from 'xdate';
import PropTypes from 'prop-types';
import styleConstructor from './style';
import { weekDayNames } from '../../dateutils';

class CalendarHeader extends Component {
  static propTypes = {
    theme: PropTypes.object,
    hideArrows: PropTypes.bool,
    month: PropTypes.instanceOf(XDate),
    addMonth: PropTypes.func,
    showIndicator: PropTypes.bool,
    firstDay: PropTypes.number,
    renderArrow: PropTypes.func,
    hideDayNames: PropTypes.bool,
    weekNumbers: PropTypes.bool,
    onPressArrowLeft: PropTypes.func,
    onPressArrowRight: PropTypes.func
  };

  static defaultProps = {
    monthFormat: 'MMMM yyyy',
  };

  constructor(props) {
    super(props);
    this.style = styleConstructor(props.theme);
    this.addMonth = this.addMonth.bind(this);
    this.substractMonth = this.substractMonth.bind(this);
    this.onPressLeft = this.onPressLeft.bind(this);
    this.onPressRight = this.onPressRight.bind(this);

    this.state = {
      wrapperWidth: 0
    }

    this.leftArrow = this.leftArrow.bind(this)
    this.rightArrow = this.rightArrow.bind(this)
  }

  addMonth() {
    this.props.addMonth(1);
  }

  substractMonth() {
    this.props.addMonth(-1);
  }

  shouldComponentUpdate(nextProps) {
    if (
      nextProps.month.toString('yyyy MM') !==
      this.props.month.toString('yyyy MM')
    ) {
      return true;
    }
    if (nextProps.showIndicator !== this.props.showIndicator) {
      return true;
    }
    if (nextProps.hideDayNames !== this.props.hideDayNames) {
      return true;
    }
    return false;
  }

  onPressLeft() {
    console.log('this.state.wrapperWidth', this.state.wrapperWidth)
    const {onPressArrowLeft} = this.props;
    if(typeof onPressArrowLeft === 'function') {
      return onPressArrowLeft(this.substractMonth);
    }
    return this.substractMonth();
  }

  onPressRight() {
    console.log('this.state.wrapperWidth', this.state.wrapperWidth)
    const {onPressArrowRight} = this.props;
    if(typeof onPressArrowRight === 'function') {
      return onPressArrowRight(this.addMonth);
    }
    return this.addMonth();
  }

  leftArrow () {
    return (
      <TouchableOpacity
        onPress={this.onPressLeft}
        style={[this.style.arrow, {borderWidth: 1, borderColor: '#797979', borderRadius: 2, width: this.state.wrapperWidth / 7, height: this.state.wrapperWidth / 7, left: -10, justifyContent: 'center', alignItems: 'center'}]}
        hitSlop={{left: 20, right: 20, top: 20, bottom: 20}}
      >
        {this.props.renderArrow
          ? this.props.renderArrow('left')
          : <Image
            source={require('../img/previous.png')}
            style={[this.style.arrowImage, {height: 17.5, width: 10}]}
          />}
      </TouchableOpacity>
    )
  }

  rightArrow () {
    return (
      <TouchableOpacity
        onPress={this.onPressRight}
        style={[this.style.arrow, {borderWidth: 1, borderColor: '#797979', borderRadius: 2, width: this.state.wrapperWidth / 7, height: this.state.wrapperWidth / 7, right: -10, justifyContent: 'center', alignItems: 'center'}]}
        hitSlop={{left: 20, right: 20, top: 20, bottom: 20}}
      >
        {this.props.renderArrow
          ? this.props.renderArrow('right')
          : <Image
            source={require('../img/next.png')}
            style={[this.style.arrowImage, {height: 17.5, width: 10}]}
          />}
      </TouchableOpacity>
    )
  }


  render() {
    let weekDaysNames = weekDayNames(this.props.firstDay);
    let indicator;
    if (this.props.showIndicator) {
      indicator = <ActivityIndicator />;
    }
    return (
      <View onLayout={(event) => {
        this.setState({
          wrapperWidth: event.nativeEvent.layout.width
        }, () => {
          this.forceUpdate()
        })
      }}>
        <View style={[this.style.header]}>
          {this.leftArrow()}
          <View style={{ flexDirection: 'row' }}>
            <Text allowFontScaling={false} style={this.style.monthText} accessibilityTraits='header'>
              {this.props.month.toString(this.props.monthFormat)}
            </Text>
            {indicator}
          </View>
          {this.rightArrow()}
        </View>
        {
          !this.props.hideDayNames &&
          <View style={this.style.week}>
            {this.props.weekNumbers && <Text allowFontScaling={false} style={this.style.dayHeader}></Text>}
            {weekDaysNames.map((day, idx) => (
              <Text allowFontScaling={false} key={idx} accessible={false} style={this.style.dayHeader} numberOfLines={1} importantForAccessibility='no'>{day}</Text>
            ))}
          </View>
        }
      </View>
    );
  }
}

export default CalendarHeader;
