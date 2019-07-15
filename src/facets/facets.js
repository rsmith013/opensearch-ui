import React from "react";


class FacetOption extends React.Component {
    render() {
        const facetOption = this.props.option;
        return (
            <tr>
                <td><input type="checkbox" name={facetOption['@value']}/> {facetOption['@label']}</td>
            </tr>
        )
    }
}

class FacetCategory extends React.Component {
    render() {
        const parameter = this.props.parameter;
        const facetLabels = []

        parameter.Option.forEach((option, i) => {
                facetLabels.push(<FacetOption option={option} key={i}/>)
            }
        );

        return (
            <div className="card">
                <div className="card-header">
                    <a data-toggle="collapse" href={"#" + parameter['@name']} role="button"
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
                    facets.push(<FacetCategory parameter={parameter} key={parameter['@name']}/>)
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