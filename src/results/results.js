import React from "react";

function deParam(querystring) {
  // remove any preceding url and split
  querystring = querystring.substring(querystring.indexOf('?')+1).split('&');
  var params = {}, pair, d = decodeURIComponent;
  // march and parse
  for (var i = querystring.length - 1; i >= 0; i--) {
    pair = querystring[i].split('=');

    var key = d(pair[0]);
    var val = d(pair[1]) || '';

    if (params.hasOwnProperty(key)) {
      if (Array.isArray(params[key])) {
          params[key].unshift(val);
      } else {
          params[key] = [params[key]];
          params[key].unshift(val);
      }
    } else {
      params[key] = val;
    }


  }

  return params;
}

class ResultsPane extends React.Component {
    // Main results pane
    constructor(props){
        super(props);

        this.getNoPages = this.getNoPages.bind(this);
    }

    getNoPages(){
        const totalResults = this.props.results.totalResults;
        const itemsPerPage = this.props.results.itemsPerPage;

        return Math.ceil(totalResults/itemsPerPage)
    }

    render() {
        return (
            <div>
                <ItemsPerPage/>
                <SearchInfo metadata={this.props.results}/>
                <ResultList features={this.props.results.features} updateTarget={this.props.updateTarget}/>
                <NavigationLinks links={this.props.results.links} pages={this.getNoPages()}/>
            </div>
        )
    }
}

export default ResultsPane;

class SearchInfo extends React.Component {
    // Search parameters

    render() {
        const searchMeta = this.props.metadata;

        return (
            <div className="row">
                <div className="col">
                    <h6>{searchMeta.subtitle}</h6>
                </div>
                <div className="col">
                    <h6>Total Results: {searchMeta.totalResults}</h6>
                </div>
            </div>
        )
    }
}

class ItemsPerPage extends React.Component {
    // Items per page selector

    render() {
        return (
            <div className="row justify-content-end">
                <div className="col-2">
                    <select className="custom-select">
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                </div>
            </div>

        )
    }
}


class ResultList extends React.Component {
    // Table of results

    render() {
        const rows = [];


        this.props.features.forEach((result) => {
                rows.push(
                    <Result result={result} key={result.id} updateTarget={this.props.updateTarget}/>
                )
            }
        );

        return (
            <table className="table table-striped">
                <thead className="thead-dark">
                <tr>
                    <th>Results</th>
                </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>

        )
    }
}

class Result extends React.Component {
    // Individual results

    render() {
        const result = this.props.result;

        return <tr>
            <td>{result.properties.title}
                <LinkSet
                    links={result.properties.links}
                    updateTarget={this.props.updateTarget}
                    id={result.properties.identifier}
                />
            </td>
        </tr>
    }
}

class LinkSet extends React.Component {
    // Links sets
    constructor(props) {
        super(props);

        this.parseLinks = this.parseLinks.bind(this)
    }

    parseLinks() {
        const links = [];
        const id = this.props.id;

        if (this.props.links) {
            this.props.links.forEach((link) => {
                Object.keys(link).forEach((rel) => {
                    link[rel].forEach((clickableLink) => {
                        links.push(<ResultLink
                            rel={rel}
                            link={clickableLink}
                            updateTarget={this.props.updateTarget}
                            id={id}
                            key={clickableLink.href}/>)
                    })
                })
            });
        }

        return links
    }

    render() {
        const links = this.parseLinks();

        return (
            <div className="row">{links}</div>)
    }
}


class ResultLink extends React.Component {
    // Individual links

    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);
        this.onNavigate = this.onNavigate.bind(this);
    }

    onClick(event) {
        // Disable default click behaviour
        event.preventDefault();

        this.props.updateTarget(event.currentTarget.href, this.props.id)
    }

    onNavigate(event) {
        // Disable default click behaviour
        event.preventDefault();

        // Extract query params
        console.log(deParam(event.currentTarget.href))



    }

    render() {
        const link = this.props.link;
        const rel = this.props.rel;

        switch (rel) {
            case "search":
                return(<div className="col"><a rel={rel} href={link.href} type={link.type} onClick={this.onClick}>{link.title}</a></div>)
            case "first":
                return(<div className="col-1 text-center"><a rel={rel} href={link.href} onClick={this.onNavigate}><i className="fas fa-fast-backward"/>{link.title}</a></div>)
            case "previous":
                return(<div className="col-1 text-center"><a rel={rel} href={link.href} onClick={this.onNavigate}><i className="fas fa-step-backward"/>{link.title}</a></div>)
            case "next":
                return(<div className="col-1 text-center"><a rel={rel} href={link.href} onClick={this.onNavigate}><i className="fas fa-step-forward"/>{link.title}</a></div>)
            case "last":
                return(<div className="col-1 text-center"><a rel={rel} href={link.href} onClick={this.onNavigate}><i className="fas fa-fast-forward"/>{link.title}</a></div>)
            default:
                return(<div className="col"><a rel={rel} href={link.href} type={link.type}>{link.title}</a></div>)
        }


    }
}

class NavigationLinks extends LinkSet {
    render() {

        const links = this.parseLinks()


        return (
            <div className="row justify-content-center">
                {links}
            </div>

        )
    }
}




