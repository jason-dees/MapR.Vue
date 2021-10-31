import 'bootstrap';

export const module = {
    loaders: [
        {
            test: /\.vue$/,
            loader: 'vue'
        },
        {
            test: /\.s[a|c]ss$/,
            loader: 'style!css!sass'
        }
    ]
};
export const vue = {
    loaders: {
        scss: 'style!css!sass'
    }
};