const api = 'http://192.168.31.116:8000/miniprogram'
// const api = 'https://www.iamxiaogang.fun/miniprogram'

module.exports = {
    root:api,
    refresh:api+'/users/refresh/',
    update:api+'/users/user/update/',
    send_code:api+'/users/send_code/',
    login:api+'/users/login/',
    document:api+'/document/articles/',
    create_article:api+'/document/create/',
    upload_image:api+'/document/upload-image/',
    comment:api+'/document/comment/',
    knowledge:api+'/knowledge/',
    konw_comment:api+'/knowledge/comment/',
    pdftoword:api+'/tools/pdftoword/',
    mergepdf:api+'/tools/merge_pdfs/',
    updatepdf:api+'/tools/upload_pdf/',
    banners:api+'/tools/banners/'

}