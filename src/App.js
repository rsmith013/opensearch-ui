import React from 'react';
import './App.css';
import $ from 'jquery';
import xml2json from './xmlToJson';
import loading from './loading.gif'
import ResultsPane from './results/results'
import FacetFilter from './facets/facets'

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            target: this.props.opensearch_url + "/description.xml",
            queryParams: {}
        };

        this.loadDescription = this.loadDescription.bind(this);
        this.updateDescriptionTarget = this.updateDescriptionTarget.bind(this);
        this.add_query_param = this.add_query_param.bind(this);
        this.remove_query_param = this.remove_query_param.bind(this);
        this.set_query_params = this.set_query_params.bind(this);
        this.search = this.search.bind(this)
    }

    componentDidMount() {
        this.loadDescription()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        if (this.state.target !== prevState.target) {
            this.loadDescription()
        }

        if (this.state.search) {
            this.setState({search: false});
            this.search()
        }
    }

    updateDescriptionTarget(target, collectionId) {
        this.setState({
            target: target,
            results: undefined,
            queryParams: {
                collectionId: collectionId
            }
        });
    }

    loadDescription() {
        $.get({
            url: this.state.target,
            dataType: 'xml',
            success: (xmldoc) => {
                const json = xml2json(xmldoc);
                this.setState({description: json.OpenSearchDescription})
            },
            error: (data) => {
                alert('fail')
                console.log(data)
            }

        });
    }

    add_query_param(key, value) {
        let new_state = Object.assign({}, this.state);
        new_state.queryParams[key] = value;
        new_state.search = true;
        this.setState(new_state);

    }

    remove_query_param(key, value) {
        let new_state = Object.assign({}, this.state);
        delete new_state.queryParams[key]
        new_state.search = true;
        this.setState(new_state)
    }

    set_query_params(params) {
        let new_state = Object.assign({}, this.state, {queryParams: params});
        this.setState(new_state);
        new_state.search = true;
    }

    search() {
        const keys = Object.keys(this.state.queryParams);

        let params = [];

        let url = this.props.opensearch_url + "/request?";

        keys.forEach((key) => {
            switch (key) {
                case "searchTerms":
                    params.push("query=" + this.state.queryParams[key]);
                    break;
                default:
                    params.push(key + "=" + this.state.queryParams[key]);
            }
        });

        url = url + params.join('&') + "&httpAccept=application/geo%2Bjson";

        console.log(url);

        $.get({
            url: url,
            dataType: 'json',
            success: (json) => {

                this.setState({results: json})
            },
            error: (data) => {
                alert('fail');
                console.log(data)
            }

        });
    }


    render() {

        if (this.state.description) {
            return (
                <div className="container">
                    <PageTitle description={this.state.description}/>
                    <FacetedSearch
                        state={this.state}
                        updateTarget={this.updateDescriptionTarget}
                        add_query_param={this.add_query_param}
                        remove_query_param={this.remove_query_param}
                        set_query_params={this.set_query_params}

                    />
                </div>
            );
        } else {
            return (
                <div className="container text-center">
                    <img src={loading} alt="loading content"/>
                </div>
            )
        }
    }

}

export default App;


class FacetedSearch extends React.Component {

    render() {
        const results = this.props.state.results;
        const queryParams = this.props.state.queryParams;
        const urls = this.props.state.description.Url;


        if (this.props.state.results) {
            return (
                <div className="row">
                    <div className="col-3">
                        <FacetFilter urls={urls}
                                     add_query_param={this.props.add_query_param}
                                     remove_query_param={this.props.remove_query_param}
                        />
                    </div>
                    <div className="col-9">
                        <SearchBar add_query_param={this.props.add_query_param}/>
                        <QueryParamList queryParams={queryParams}/>
                        <ResultsPane
                            results={results}
                            updateTarget={this.props.updateTarget}
                            set_query_params={this.props.set_query_params}
                            add_query_param={this.props.add_query_param}
                        />
                    </div>
                </div>
            )
        } else {
            return (
                <div className="row">
                    <div className="col-3">
                        <FacetFilter
                            urls={urls}
                            add_query_param={this.props.add_query_param}
                            remove_query_param={this.props.remove_query_param}
                        />
                    </div>
                    <div className="col-9">
                        <SearchBar add_query_param={this.props.add_query_param}/>
                        <QueryParamList queryParams={queryParams}/>

                    </div>
                </div>
            )
        }
    }
}


class SearchBar extends React.Component {

    constructor(props) {
        super(props);
        this.searchSubmit = this.searchSubmit.bind(this);
    }

    searchSubmit(event) {
        event.preventDefault();
        event.stopPropagation();
        const search_input = $('#search')
        const search_val = search_input.val();
        search_input.val('');
        this.props.add_query_param('searchTerms', search_val)
    }

    render() {

        return (
            <div className="row">
                <div className="col">
                    <form onSubmit={this.searchSubmit}>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" placeholder="Search" id="search"
                                   aria-label="search"/>
                            <div className="input-group-append">
                                <button className="btn btn-outline-secondary" type="submit">
                                    Search
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

        )
    }
}


class PageTitle extends React.Component {
    render() {
        const description = this.props.description

        return (
            <div>
                <h1>{description.ShortName['#text']} </h1>
                <h4>{description.Description['#text']}</h4>
            </div>
        )
    }
}


class QueryParam extends React.Component {

    render() {

        return (
            <span className="badge badge-info">{this.props.param}:{this.props.value}</span>
        )
    }

}

class QueryParamList extends React.Component {
    render() {

        const query_params = this.props.queryParams;
        const param_tags = [];

        Object.keys(query_params).forEach((param) => {
            param_tags.push(<QueryParam param={param} key={param} value={query_params[param]}/>)

        });

        return (
            <div className="row">
                <div className="col">
                    {param_tags}
                </div>
            </div>
        )
    }
}




