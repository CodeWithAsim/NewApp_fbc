import React, { useEffect , useState } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';

const News = (props) => {

    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);

    const capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const updateNews = async () => {

        props.setProgress(10);

        let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pagesize=${props.pageSize}`;

        setLoading(true);

        let data = await fetch(url);

        props.setProgress(30);

        let parsedData = await data.json();

        props.setProgress(70);

        console.log(parsedData);

        setArticles(parsedData.articles);
        setTotalResults(parsedData.totalResults);
        setLoading(false);

        props.setProgress(100);
    }

    useEffect(() => {
        document.title = `${capitalize(props.category)} - News Monkey `;
        updateNews();
        //eslint-disable-next-line
    }, [])

    const fetchMoreData = async () => {

        let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page + 1}&pagesize=${props.pageSize}`;

        setPage(page + 1);

        // this.setState({ loading: true });

        let data = await fetch(url);

        let parsedData = await data.json();

        console.log(parsedData);

        setArticles(articles.concat(parsedData.articles));
        setTotalResults(parsedData.totalResults);
    }

    return (
        <>
            <div className="container my-3 ">
                <div className="container" style={{ margin: "35px 0px", marginTop: "98px" }}>
                    <h1 className="text-center">News Monkey - Top {capitalize(props.category)} Headlines</h1>
                </div>
                {loading && <Spinner />}
                <InfiniteScroll
                    dataLength={articles.length} //This is important field to render the next data
                    next={fetchMoreData}
                    hasMore={articles.length !== totalResults}
                    loader={<Spinner />} >

                    <div className="container">
                        <br />
                        <div className="row">
                            {/* {!(this.state.loading) && this.state.articles.map((element) => { */}
                            {articles.map((element) => {
                                return <div className="col-md-4" key={element.url}>
                                    {/* <NewsItem title={element.title.slice(0,44)} description={element.description.slice(0,88)} imageUrl={element.urlToImage} newsUrl={element.url}/> */}
                                    <NewsItem title={element.title ? element.title : ""} description={element.description ? element.description : ""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                                </div>
                            })}
                        </div>
                    </div>
                </InfiniteScroll>
            </div>
        </>
    )
}

News.defaultProps = {
    pageSize: 9,
    country: "us",
    category: "general",
}

News.propTypes = {
    pageSize: PropTypes.number,
    country: PropTypes.string,
    category: PropTypes.string
}

export default News;
