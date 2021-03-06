/**
 * @license
 * Copyright 2020 Carles Ferrando Garcia (ferrando_cariga@gva.es)
 * SPDX-License-Identifier: BSD-3-Clause
 */

var MSG = {
    title: "S4E",
    appName: "udio4Education",
    blocks: "Bloques",
    prog: "Program",
    catLogic: "Lógica",
    catLoops: "Bucles",
    catMath: "Matemáticas",
    catText: "Texto",
    catLists: "Listas",
    catColour: "Color",
    catVariables: "Variables",
    catFunctions: "Funciones",
    listVariable: "lista",
    textVariable: "texto",
    screenshot: "Descarga una captura de pantalla",
    xmlError: "No se puede descargar vuestro fichero guardado. Quizás se ha creado con un versión diferente de S4E?",
    badXml: "Error de análisis XML:\n%1\n\nSelecciona 'De acuerdo' para abandonar los cambios o 'Cancela' para continuar editando el fichero.",
    languageSpan: "escoge idioma",
    interfaceColorSpan: "interface theme",
    codeEditorColorSpan: "code editor theme",
    themeSpan: "escoge tema",
    renderSpan: "escoge renderizador",
    fullScreenButton_span: "full screen",
    undoButton_span: "Deshaz",
    redoButton_span: "Rehaz",
    boardButtonSpan: "list boards",
    verifyButton_span: "Verifica código",
    serialButtonSpan: "list COM port",
    uploadButton_span: "Carga",
    serialConnectButton_span: "Monitor serie",
    saveCodeButton_span: "Exporta código Arduino",
    newButton_span: "Proyecto nuevo",
    save_span: "Save file name?",
    saveXMLButton_span: "Guarda fichero S4E",
    loadXMLfakeButton_span: "Carga fichero S4E",
    loadXML_span: "Replace existing blocks?\n'Cancel' will merge.",
    loadXML_error_span: "Error parsing XML:\n",
    resetButton_span: "Restablece S4E",
    resetQuestion_span: "Reset S4E and",
    helpButton_span: "ayuda",
    helpModalSpan_title: "Help - About",
    helpModalSpan_text:
        '<table>' +
        '<tbody>' +
        '<tr>' +
        '<td style="width: 142px;"><img src="./S4E/media/logo_only.png" alt="" width="129" height="144" /></td>' +
        '<td>' +
        '<p style="text-align: left;"><strong>STudio4Education</strong></p>' +
        '<p style="text-align: left;">Designed for <strong>Arrowhead</strong> Tools Project (<a href="https://www.arrowhead.eu/arrowheadtools" rel="nofollow">https://www.arrowhead.eu/arrowheadtools</a>), STudio4Education is a <strong>web-based visual programming editor for <a href="https://www.st.com" rel="nofollow">ST microelectronics</a></strong> boards, thanks to <a href="https://developers.google.com/blockly/" rel="nofollow">Blockly</a>, the web-based, graphical programming editor.</p>' +
        '<p style="text-align: left;">STudio4Education provides static type language blocks and code generators for simple C programming.</p>' +
        '</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>' +
        '<p style="text-align: left;">Accessibility: <a href="https://github.com/A-S-T-U-C-E/STudio4Education#accessibility">online documentation</a>.</p>' +
        '<p style="text-align: left;">Blockly official documentation: <a href="https://developers.google.com/blockly/guides/configure/web/keyboard-nav" rel="nofollow">Blockly developers</a>.</p>' +
        '<p style="text-align: left;">Wiki : <a href="https://github.com/A-S-T-U-C-E/STudio4Education/wiki">on Github</a>.</p>' +
        '<p style="text-align: left;">A bug? Post it here: <a href="https://github.com/A-S-T-U-C-E/STudio4Education/issues">on Github</a>.</p>' +
        '<p style="text-align: center;">v0.8.0 - BSD3 license - Sébastien CANET',
    //menu tools
    toolsButton_span: "tools",
    wiringButton_span: "wiring",
    factoryButton_span: "block factory",
    htmlButton_span: "HTML factory",
    colorConversionButton_span: "colors encoding",
    dataConversionButton_span: "data encoding",
    //menu IoT
    iotConnectButton_span: "servers",
    launchWebServer_span: "local server",
    papyrusConnect_span: "Papyrus connect",
    registerToOrchestrator_span: "Arrowhead connect",
    blynkConnect_span: "Blynk connect",
    //ace editor
    editorReadOnlyToggle_span: "code editor writable or read-only",
    copyCodeButton_span: "Copia código a  portapapeles",
    //lateral panel
    accessibilitySpan: "habilita modo accesibilidad",
    defaultCursorSpan: "Cursor por defecto",
    basicCursorSpan: "Cursor básico",
    lineCursorSpan: "Cursor linia",
    keyMappingSpan: "abre asignaciones de teclado",
    themeClassicSpan: "Clásico",
    themeModernSpan: "Moderno",
    themeDeuteranopiaSpan: "Deuteranopia/Protanopia",
    themeTritanopiaSpan: "Tritanopia",
    themeZelosSpan: "Zelos",
    themeHighContrastSpan: "Alto contraste",
    themeDarkSpan: "Oscuro",
    themeBwSpan: "Negro & Blanco",
    compilationInProgress: "Placa",
    keyMappingModalSpan: "Establece asignaciones de teclado",
    detailedCompilation_span: "Compilación detallada con mensajes",
    CLI_title_span: "Configura compiler",
    installBoard_title_span: "instala placa al CLI",
    searchlLib_title_span: "busca una biblioteca",
    installLib_title_span: "instala biblioteca  al CLI",
    actionName0: "previo",
    actionName1: "siguiente",
    actionName2: "entra al bloque",
    actionName3: "sal del bloque",
    actionName4: "inserte",
    actionName5: "marca",
    actionName6: "desconecta",
    actionName7: "Caja de herramientas",
    actionName8: "salida",
    actionName9: "mueve el espacio de trabajo arriba",
    actionName10: "mueve el espacio de trabajo abajo",
    actionName11: "mueve el espacio de trabajo a izquierda",
    actionName12: "mueve el espacio de trabajo a derecha",
    actionName13: "conmuta el teclado de navegación",
    setup_sideButton_span: "configura",
    config_UI_title_span: "interface",
    displaySpan: "display choice",
    displayChoiceButtons: "buttons only",
    displayChoiceBandT: "buttons + text",
    displayChoiceText: "text only",
    fontSpan: "font choice",
    fontSizeSpan: "renderización",
    optionFontSizeBlocks: "Tamaño del tipo de letra bloques",
    optionFontSizePage: "Tamaño del tipo de letra página",
    optionFontSpacingPage: "Espaciado de letra página",
    //CLI_functions.js
    CLI_githubLinkButton_span: "documentación",
    coreUpdateButton_msg: "Se está actualizando...\n<i class='fa fa-spinner fa-pulse fa-1_5x fa-fw'></i>",
    cleanCLIcacheButton_msg: "Se está limpiando...\n<i class='fa fa-spinner fa-pulse fa-1_5x fa-fw'></i>",
    cleanCLIcacheButton_error_msg: "Error suprimiendo la carpeta .\\tmp",
    cleanCLIcacheButton_success_msg: "Limpiado!",
    listBoardsButton_msg: "Se está buscando la placa...\n<i class='fa fa-spinner fa-pulse fa-1_5x fa-fw'></i>",
    installBoardsButton_msg: "Se está instalando el soporte de la placa, espera...\n<i class='fa fa-spinner fa-pulse fa-1_5x fa-fw'></i>",
    searchlLibButton_msg: "Se está buscando la biblioteca...\n<i class='fa fa-spinner fa-pulse fa-1_5x fa-fw'></i>",
    installLibButton_msg: "Se está instalando la biblioteca...\n<i class='fa fa-spinner fa-pulse fa-1_5x fa-fw'></i>",
    coreUpdateButton_span: "actualiza núcleo y bibliotecas",
    cleanCLIcacheButton_span: "Se está limpiando caché",
    listBoardsButton_span: "detección y listado de placas",
    installBoardsInput_span: "nombre de la placa a soportar",
    installBoardsButton_span: "instala este tipo de placa",
    searchlLibInput_span: "nombre de la biblioteca a buscar",
    searchlLibButton_span: "busca esta biblioteca",
    installLibInput_span: "nombre de la biblioteca a instalar",
    installLibButton_span: "instala esta biblioteca",
    //categories panel
    categories_title_span: "categories choice",
    //arrowhead panel
    iot_title_span: "IoT control",
    //modals
    boardListModalHeader_span: "Boards list",
    boardListModalButton_span: "Details",
    boardModal_connect: "Connector",
    boardModal_voltage: "Operating voltage",
    boardModal_voltage_normal: "Operating voltage (recommended)",
    boardModal_voltage_maxi: "Operating voltage (limits)",
    boardModal_cpu: "Microcontroler µC",
    boardModal_speed: "Clock speed",
    boardModal_inout: "Number of logical I/Os",
    boardModal_in_analog: "Number of analogue I/Os",
    boardModal_out_analog: "Number of PWM ouput",
    boardModal_i_max_out: "Max. current per pin (5V)",
    boardModal_i_max3: "Max. output current on pin 3.3V",
    boardModal_i_max_5: "Max. output current on pin 5V",
    boardModal_flash: "Flash memory",
    boardModal_sram: "SRAM memory",
    boardModal_eeprom: "EEPROM",
    portListModalHeader_span: "COMM port list",
    //IDE_functions.js
    IDE_connect: 'Connect to port ',
    IDE_select_port: 'Select a port !',
    IDE_select_board: 'Select a board !',
    IDE_verif_progress: '\nVerification: in progress...\n<i class="fa fa-spinner fa-pulse fa-1_5x fa-fw"></i>',
    IDE_verif_ok: '\nVerification: OK',
    IDE_upload1: 'Board ',
    IDE_upload2: ' on port ',
    IDE_upload3: '\nUpload: in progress...\n<i class="fa fa-spinner fa-pulse fa-1_5x fa-fw"></i>',
    IDE_upload_ok: '\nUpload: OK',
    serial_btn_start: "<span class='fa fa-play'></span> Start",
    serial_info_stop: 'stop<br>',
    serial_btn_stop: "<span class='fa fa-pause'></span> Stop",
    serial_info_start: 'communication starting<br>',
    serial_CSV: 'Export data to CSV',
    inputTextSerial: 'Text',
    btn_serialSend_span: 'Send',
    btn_serialConnect_span: 'Start',
    btn_serialPeekClear_span: 'Clean',
    btn_serialPeekCSV_span: 'Export',
    btn_serialChart_span: 'Graph',
    btn_serialChartPause_span: 'Start'
};