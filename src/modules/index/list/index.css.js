var React = require('react-native');
var { StyleSheet } = React;
module.exports = StyleSheet.create({
    "contains": {
        "flex": 1
    },
    "MovieList": {
        "borderTopColor": "#ddd",
        "borderTopWidth": 1,
        "marginTop": 10,
        "height": 40,
        "paddingTop": 4,
        "paddingBottom": 4,
        "paddingRight": 4,
        "paddingLeft": 4,
        "justifyContent": "center",
        "backgroundColor": "#ffffff"
    },
    "Button": {
        "bottom": 0,
        "position": "absolute",
        "width": "100%"
    },
    "rowBack": {
        "alignItems": "center",
        "flex": 1,
        "flexDirection": "row",
        "justifyContent": "space-between"
    },
    "backRightBtn": {
        "bottom": 0,
        "position": "absolute",
        "top": 0,
        "right": 0
    },
    "backTextWhite": {
        "color": "#ffffff",
        "height": 40,
        "marginTop": 10,
        "backgroundColor": "red",
        "justifyContent": "center",
        "lineHeight": 40,
        "width": 50,
        "textAlign": "center"
    }
});