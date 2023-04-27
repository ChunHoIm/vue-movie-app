import axios from 'axios';
import _uniqBy from "lodash/uniqBy";

const _defaultMsg = "Search for the movie title";

export default {
    // module화 명시
    namespaced: true,
    // data
    state: () => ({
        movies: [],
        message: _defaultMsg,
        loading: false,
        theMovie: {}
    }),
    // computed
    getters: {
        // movieIds(state) {
        //     return state.movies.map(m => m.imdbID);
        // }
    },
    // methods
    // mutations에서만 data 변경
    mutations: {
        updateState(state, payload) {
            // ['movies', 'message', 'loading']
            Object.keys(payload).forEach(key => {
                state[key] = payload[key];
            });
        },
        resetMovies(state) {
            state.movies = [];
            state.message = _defaultMsg;
            state.loading = false;
        }
    },
    // 비동기(async) (데이터 변경이 아닌 메소드들)
    actions: {
        async searchMovies({state, commit}, payload) {
            if(state.loading) {
                alert("Loading...");
                return;
            }
            commit("updateState", {
                message: "",
                loading: true,
            });
            try {

                const res = await _fetchMovie({
                    ...payload,
                    page: 1
                });
                const { Search, totalResults } = res.data;

                commit("updateState", {
                    movies: _uniqBy(Search,"imdbID"),
                    loading: true
                });

                const total = parseInt(totalResults, 10);
                const pageLength = Math.ceil(total / 10);

                if(pageLength > 1) {
                    for(let page = 2; page <= pageLength; page++) {
                        if(page > payload.number / 10) break;
                
                        const res = await _fetchMovie({
                            ...payload,
                            page
                        });
                        const { Search } = res.data;

                        commit("updateState", {
                            movies: [...state.movies, ..._uniqBy(Search, "imdbID")]
                        });

                    }
                }
            } catch (message) {
                commit("updateState", {
                    movies: [],
                    message
                });
            } finally {
                commit("updateState", {
                    loading: false
                });
            }

        },

        async searchMovieWithId({ state, commit }, payload) {
            if(state.loading) {
                alert("Loading...");
                return;
            }

            commit("updateState", {
                theMovie: {},
                loading: true
            });

            try {
                const res = await _fetchMovie(payload);
                console.log(res.data);
                commit("updateState", {
                    theMovie: res.data
                });
            } catch (error) {
                commit("updateState", {
                    theMovie: {}
                });
            } finally {
                commit("updateState", {
                    loading: false
                });
            }
        }
    }
};

function _fetchMovie(payload) {

    const { title, type, page, year, id } = payload;
    const OMDB_API_KEY = "7035c60c";
    const url = id
                ? `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${id}` 
                : `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${title}&type=${type}&page=${page}&y=${year}`;
    // const url =`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}`;

    return new Promise((resolve, reject) => {
        axios.get(url)
        .then((res) => {
            if(res.data.Error) reject(res.data.Error);
            resolve(res);
        })
        .catch((error) => {
            reject(error.message);
        });
    });
}