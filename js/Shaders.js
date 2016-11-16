 function getShader(gl, id) {
        var shaderScript = document.getElementById(id);
        if (!shaderScript) {
            return null;
        }

        var str = "";
        var k = shaderScript.firstChild;
        while (k) {
            if (k.nodeType == 3) {
                str += k.textContent;
            }
            k = k.nextSibling;
        }

        var shader;
        if (shaderScript.type == "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (shaderScript.type == "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }

        gl.shaderSource(shader, str);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }


    function createProgram(fragmentShaderID, vertexShaderID) {
        var fragmentShader = getShader(gl, fragmentShaderID);
        var vertexShader = getShader(gl, vertexShaderID);

        program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            alert("No se pudieron inicializar los shaders");
        }

        program.vertexPositionAttribute = gl.getAttribLocation(program, "aVertexPosition");
        gl.enableVertexAttribArray(program.vertexPositionAttribute);

        program.vertexNormalAttribute = gl.getAttribLocation(program, "aVertexNormal");
        gl.enableVertexAttribArray(program.vertexNormalAttribute);

        program.textureCoordAttribute = gl.getAttribLocation(program, "aVertexColor");
        gl.enableVertexAttribArray(program.textureCoordAttribute);

        program.ColorDif = gl.getAttribLocation(program, "aVertexColorDif");
        gl.enableVertexAttribArray(program.ColorDif);

        program.Opcion = gl.getAttribLocation(program, "aVertexOption");
        gl.enableVertexAttribArray(program.Opcion);

        program.pMatrixUniform = gl.getUniformLocation(program, "uPMatrix");
        program.mvMatrixUniform = gl.getUniformLocation(program, "uMVMatrix");
        program.nMatrixUniform = gl.getUniformLocation(program, "uNMatrix");
        program.samplerUniform = gl.getUniformLocation(program, "uSampler");
        program.useTexturesUniform = gl.getUniformLocation(program, "uUseTextures");
        program.useLightingUniform = gl.getUniformLocation(program, "uUseLighting");
        program.ambientColorUniform = gl.getUniformLocation(program, "uAmbientColor");
        program.pointLightingLocationUniform = gl.getUniformLocation(program, "uPointLightingLocation");
        program.pointLightingColorUniform = gl.getUniformLocation(program, "uPointLightingColor");

        return program;
    }



    var currentProgram;
    var perVertexProgram;
    var perFragmentProgram;

    function initShaders() {
        perFragmentProgram = createProgram("shader-fs", "shader-vs");
    }