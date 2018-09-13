import React, {Component} from "react";
import classNames from "classnames";
import Locales from '../../../../../strings'

export default class NavigationHeader extends Component {
    render() {
        return (
            <div>
                <h2 id="LeftNavigationHeader" className={'sROnly'}>{Locales.strings.problems_to_solve}</h2>
                <div className={'row'}>
                    <div className={classNames('col-lg-12', 'text-center')}>
                        <h2>{Locales.strings.select_a_problem}</h2>
                        <br/><br/>
                    </div>
                </div>
            </div>
        );
    }
}
