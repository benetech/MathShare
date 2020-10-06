import React, { Component } from 'react';
import {
    Select,
} from 'antd';
import styles from './styles.scss';

const { Option } = Select;

class SelectComponent extends Component {
    handleChange = (selectedOption) => {
        if (this.props.selectOption) {
            this.props.selectOption(selectedOption);
        }
    }

    render() {
        return (
            <div className={styles.select}>
                <Select defaultValue={this.props.defaultValue || ''} size={this.props.size} dropdownMatchSelectWidth={180} dropdownClassName={`${styles.select} ${this.props.dropdownClassName || ''}`} onChange={this.handleChange}>
                    {this.props.options.map(option => (
                        <Option key={option.value} value={option.value}>{option.label}</Option>
                    ))}
                </Select>
            </div>
        );
    }
}

export default SelectComponent;
