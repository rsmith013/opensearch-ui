import React from "react";
import $ from "jquery";


class FacetOption extends React.Component {

    constructor(props) {
        super(props)
        this.onClick = this.onClick.bind(this)
    }

    onClick(event) {
        this.props.updateFacets(event)
    }

    render() {
        const facetOption = this.props.option;
        return (
            <tr>
                <td>
                    <input
                        type="checkbox"
                        onClick={this.onClick}
                        name={facetOption['@value']}
                    /> {facetOption['@label']}
                </td>
            </tr>
        )
    }
}

class FacetCategory extends React.Component {

    constructor(props) {
        super(props)

        this.updateFacets = this.updateFacets.bind(this)

    }

    updateFacets(event) {
        const param = this.props.parameter['@name'];
        const facet = $('div.card-body[id="' + param + '"]');
        const inputs = facet.find('input');
        const options = [];

        inputs.each((i) => {
            if (inputs[i].checked){
                options.push(inputs[i].name)
            }
        });

        // Check to see if options is empty
        if (options.length>0){
            this.props.add_query_param(param, options)
        } else {
            this.props.remove_query_param(param)
        }


    }

    render() {
        const parameter = this.props.parameter;
        const facetLabels = [];

        parameter.Option.forEach((option, i) => {
                facetLabels.push(<FacetOption
                    updateFacets={this.updateFacets}
                    option={option}
                    key={i}
                />)
            }
        );

        return (
            <div className="card">
                <div className="card-header">
                    <a data-toggle="collapse" data-param={parameter['@name']} href={"#" + parameter['@name']}
                       role="button"
                       aria-expanded="false">
                        {parameter['@name']}
                    </a>
                </div>
                <div className="card-body collapse" id={parameter['@name']}>
                    <table>
                        <tbody>
                        {facetLabels}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

class FacetFilter extends React.Component {
    render() {
        const facets = [];

        const facetDescription = this.props.urls[this.props.urls.findIndex(x => x['@rel'] === "results")]

        facetDescription.Parameter.forEach((parameter) => {
                if (parameter.Option) {
                    facets.push(<FacetCategory
                        add_query_param={this.props.add_query_param}
                        remove_query_param={this.props.remove_query_param}
                        parameter={parameter}
                        key={parameter['@name']}
                    />)
                }
            }
        );

        return (
            <div className="card">
                <div className="card-header text-center">
                    <h5>Search Facets</h5>
                </div>
                {facets}
            </div>
        )


    }
}


export default FacetFilter;