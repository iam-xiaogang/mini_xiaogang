import api from '../../config/setting'
const utils = require('../../utils/utils')
Page({
    data: {
        functionType: '',
       
    },
    onLoad(options) {

        const {
            type
        } = options; 
        this.setData({
            functionType: type 
        });
        
    },






});