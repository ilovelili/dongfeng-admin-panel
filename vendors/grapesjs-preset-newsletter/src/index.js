import grapesjs from 'grapesjs';

export default grapesjs.plugins.add('gjs-preset-newsletter', (editor, opts) => {
  let c = opts || {};
  let config = editor.getConfig();
  let pfx = config.stylePrefix;

  let defaults = {
    editor,
    pfx: pfx || '',
    cmdOpenImport: 'gjs-open-import-template',
    cmdTglImages: 'gjs-toggle-images',
    cmdInlineHtml: 'gjs-get-inlined-html',
    cmtTglImagesLabel: '切换图片显示',
    cmdBtnMoveLabel: '移动',
    cmdBtnUndoLabel: '撤销',
    cmdBtnRedoLabel: '重复',
    cmdBtnDesktopLabel: '台式电脑',
    cmdBtnTabletLabel: '平板电脑',
    cmdBtnMobileLabel: '手机',
    modalTitleImport: '编辑代码',
    modalTitleExport: '导出模板',
    modalLabelImport: '编辑代码',
    modalLabelExport: '导出模板',
    modalBtnImport: '导入',
    codeViewerTheme: 'hopscotch',
    openBlocksBtnTitle: c.openBlocksBtnTitle || '选择模块',
    openLayersBtnTitle: c.openLayersBtnTitle || '选择图层',
    openSmBtnTitle: c.openSmBtnTitle || '编辑式样',
    openTmBtnTitle: c.openTmBtnTitle || '设置组件',
    expTplBtnTitle: c.expTplBtnTitle || '导出模板',
    fullScrBtnTitle: c.fullScrBtnTitle || '全屏',
    swichtVwBtnTitle: c.swichtVwBtnTitle || '查看组件',
    categoryLabel: c.categoryLabel || '',
    importPlaceholder: '',
    defaultTemplate: '', // Default template in case the canvas is empty
    inlineCss: 1,
    cellStyle: {
      padding: 0,
      margin: 0,
      'vertical-align': 'top',
    },
    tableStyle: {
      height: '150px',
      margin: '0 auto 10px auto',
      padding: '5px 5px 5px 5px',
      width: '100%'
    },
    sect100BlkLabel: '1 整段',
    sect50BlkLabel: '1/2 分段',
    sect30BlkLabel: '1/3 分段',
    sect37BlkLabel: '3/7 分段',
    buttonBlkLabel: '按钮',
    dividerBlkLabel: '分隔符',
    textBlkLabel: '文本',
    textSectionBlkLabel: '文本段落',
    imageBlkLabel: '图像',
    quoteBlkLabel: '引用',
    linkBlkLabel: '链接',
    linkBlockBlkLabel: '块链接',
    gridItemsBlkLabel: '单元格项目',
    listItemsBlkLabel: '列表项目',
    assetsModalTitle: c.assetsModalTitle || '选择图像',
    styleManagerSectors: [{
        name: '位置和尺寸',
        open: false,
        buildProps: ['width', 'height', 'max-width', 'min-height', 'margin', 'padding'],
        properties:[
          { name: '宽度', property: 'width'},
          { name: '高度', property: 'height'},
          { name: '最大宽度', property: 'max-width'},
          { name: '最小高度', property: 'min-height'},
          {
            name: '页眉空白',
            property: 'margin',
            properties:[
              { name: '上', property: 'margin-top'},
              { name: '左', property: 'margin-left'},
              { name: '右', property: 'margin-right'},
              { name: '下', property: 'margin-bottom'}
            ],
          },{
            name: '缩进',
            property: 'padding',
            properties:[
              { name: '上', property: 'padding-top'},
              { name: '左', property: 'padding-left'},
              { name: '右', property: 'padding-right'},
              { name: '下', property: 'padding-bottom'}              
            ],
        }],
      },{
        name: '字体和排版',
        open: false,
        buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-align', 'text-decoration', 'font-style', 'vertical-align', 'text-shadow'],
        properties:[
          { name: '字体', property: 'font-family'},
          { name: '尺寸', property: 'font-size'},
          { name: '粗体', property: 'font-weight'},
          { name: '间隔', property: 'letter-spacing'},
          { name: '颜色', property: 'color'},
          { name: '行高', property: 'line-height'},
          {
            name: "对齐方式",
            property: 'text-align',
            type: 'radio',
            defaults: 'left',
            list: [
              { value: 'left', name: '左', className: 'fa fa-align-left'},
              { value: 'center', name: '中', className: 'fa fa-align-center' },
              { value: 'right', name: '右', className: 'fa fa-align-right'},
              { value: 'justify', name: '自动调整', className: 'fa fa-align-justify'}
            ],
          },{
            name: "文字式样",
            property: 'text-decoration',
            type: 'radio',
            defaults: 'none',
            list: [
              { value: 'none', name: '无', className: 'fa fa-times'},
              { value: 'underline', name: '下划线', className: 'fa fa-underline' },
              { value: 'line-through', name: '删除线', className: 'fa fa-strikethrough'}
            ],
          },{
            name: "字体风格",
            property: 'font-style',
            type: 'radio',
            defaults: 'normal',
            list: [
              { value: 'normal', name: '正常', className: 'fa fa-font'},
              { value: 'italic', name: '斜体', className: 'fa fa-italic'}
            ],
          },{
            name: "竖直对齐",
            property: 'vertical-align',
            type: 'select',
            defaults: 'baseline',
            list: [
              { value: 'baseline'},
              { value: 'top'},
              { value: 'middle'},
              { value: 'bottom'}
            ],
          },{
            name: "阴影效果",
            property: 'text-shadow',
            properties: [
              { name: 'X轴', property: 'text-shadow-h'},
              { name: 'Y轴', property: 'text-shadow-v'},
              { name: '模糊', property: 'text-shadow-blur'},
              { name: '颜色', property: 'text-shadow-color'}
            ],
        }],
      },{
        name: '背景和边框',
        open: false,
        buildProps: ['background-color', 'border-collapse', 'border-radius', 'border', 'background'],
        properties: [{
          name: '背景色',
          property: 'background-color',          
        },{
          name: '边框半径',
          property: 'border-radius',
          properties  : [
            { name: '上', property: 'border-top-left-radius'},
            { name: '右', property: 'border-top-right-radius'},
            { name: '底', property: 'border-bottom-left-radius'},
            { name: '左', property: 'border-bottom-right-radius'}
          ],
        },{
          name: '合并边框',
          property: 'border-collapse',
          type: 'radio',
          defaults: 'separate',
          list: [
            { value: 'separate', name: 'No'},
            { value: 'collapse', name: 'Yes'}
          ],
        },
        /*
        { // Too much low support
          property: 'box-shadow',
          properties: [
            { name: 'X position', property: 'box-shadow-h'},
            { name: 'Y position', property: 'box-shadow-v'},
            { name: 'Blur', property: 'box-shadow-blur'},
            { name: 'Spread', property: 'box-shadow-spread'},
            { name: 'Color', property: 'box-shadow-color'},
            { name: 'Shadow type', property: 'box-shadow-type'}
          ],
        },*/{
          name: '边框风格',
          property: 'border',
          properties: [
            { name: '宽度', property: 'border-width', defaults: '0'},
            { name: '式样', property: 'border-style'},
            { name: '高度', property: 'border-color'},
          ],
        },{
          property: '背景风格',
          property: 'background',
          properties: [
            { name: '背景图', property: 'background-image'},
            { name: '重复', property:   'background-repeat'},
            { name: '位置', property: 'background-position'},
            { name: '滚动背景', property: 'background-attachment'},
            { name: '尺寸', property: 'background-size'}
          ],
        }],
      }]
  };

  // Change some config
  config.devicePreviewMode = 1;

  // Load defaults
  for (let name in defaults) {
    if (!(name in c))
      c[name] = defaults[name];
  }

  // Add commands
  let importCommands = require('./commands');
  importCommands(c);

  // Add blocks
  let importBlocks = require('./blocks');
  importBlocks(c);

  // Add buttons
  let importButtons = require('./buttons');
  importButtons(c);

  // Load style manager
  let importStyle = require('./style');
  importStyle(c);

  // Set default template if the canvas is empty
  if(!editor.getHtml() && c.defaultTemplate){
    editor.setComponents(c.defaultTemplate);

    // Init components for Undo Manager
    editor.editor.initChildrenComp(editor.DomComponents.getWrapper());
  }

  // On component change show the Style Manager
  editor.on('change:selectedComponent', function() {
    var openLayersBtn = editor.Panels.getButton('views', 'open-layers');

    // Don't switch when the Layer Manager is on or
    // there is no selected component
    if((!openLayersBtn || !openLayersBtn.get('active')) &&
      editor.editor.get('selectedComponent')){
      var openSmBtn = editor.Panels.getButton('views', 'open-sm');
      openSmBtn.set('attributes',{ title:defaults.openSmBtnTitle });
      openSmBtn && openSmBtn.set('active', 1);
    }
  });

  editor.on('run:open-assets', () => {
    const modal = editor.Modal;
    modal.setTitle(defaults.assetsModalTitle);
  })

  // Do stuff on load
  editor.on('load', function() {
    var expTplBtn = editor.Panels.getButton('options', 'export-template');
    expTplBtn.set('attributes', {
      title: defaults.expTplBtnTitle
    });
    var fullScrBtn = editor.Panels.getButton('options', 'fullscreen');
    fullScrBtn.set('attributes', {
      title: defaults.fullScrBtnTitle
    });
    var swichtVwBtn = editor.Panels.getButton('options', 'sw-visibility');
    swichtVwBtn.set('attributes', {
      title: defaults.swichtVwBtnTitle
    });
    var openSmBtn = editor.Panels.getButton('views', 'open-sm');
    openSmBtn.set('attributes', {
      title: defaults.openSmBtnTitle
    });
    var openTmBtn = editor.Panels.getButton('views', 'open-tm');
    openTmBtn.set('attributes', {
      title: defaults.openTmBtnTitle
    });
    var openLayersBtn = editor.Panels.getButton('views', 'open-layers');
    openLayersBtn.set('attributes', {
      title: defaults.openLayersBtnTitle
    });    
    // Open block manager
    var openBlocksBtn = editor.Panels.getButton('views', 'open-blocks');
      openBlocksBtn.set('attributes', {
      title: defaults.openBlocksBtnTitle
    });
    openBlocksBtn && openBlocksBtn.set('active', 1);
    //editor.trigger('change:canvasOffset');
  });
});
