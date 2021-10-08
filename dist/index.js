require('./sourcemap-register.js');module.exports=(()=>{var e={351:function(e,t,n){"use strict";var i=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var n in e)if(Object.hasOwnProperty.call(e,n))t[n]=e[n];t["default"]=e;return t};Object.defineProperty(t,"__esModule",{value:true});const s=i(n(87));const o=n(278);function issueCommand(e,t,n){const i=new Command(e,t,n);process.stdout.write(i.toString()+s.EOL)}t.issueCommand=issueCommand;function issue(e,t=""){issueCommand(e,{},t)}t.issue=issue;const r="::";class Command{constructor(e,t,n){if(!e){e="missing.command"}this.command=e;this.properties=t;this.message=n}toString(){let e=r+this.command;if(this.properties&&Object.keys(this.properties).length>0){e+=" ";let t=true;for(const n in this.properties){if(this.properties.hasOwnProperty(n)){const i=this.properties[n];if(i){if(t){t=false}else{e+=","}e+=`${n}=${escapeProperty(i)}`}}}}e+=`${r}${escapeData(this.message)}`;return e}}function escapeData(e){return o.toCommandValue(e).replace(/%/g,"%25").replace(/\r/g,"%0D").replace(/\n/g,"%0A")}function escapeProperty(e){return o.toCommandValue(e).replace(/%/g,"%25").replace(/\r/g,"%0D").replace(/\n/g,"%0A").replace(/:/g,"%3A").replace(/,/g,"%2C")}},186:function(e,t,n){"use strict";var i=this&&this.__awaiter||function(e,t,n,i){function adopt(e){return e instanceof n?e:new n(function(t){t(e)})}return new(n||(n=Promise))(function(n,s){function fulfilled(e){try{step(i.next(e))}catch(e){s(e)}}function rejected(e){try{step(i["throw"](e))}catch(e){s(e)}}function step(e){e.done?n(e.value):adopt(e.value).then(fulfilled,rejected)}step((i=i.apply(e,t||[])).next())})};var s=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var n in e)if(Object.hasOwnProperty.call(e,n))t[n]=e[n];t["default"]=e;return t};Object.defineProperty(t,"__esModule",{value:true});const o=n(351);const r=n(717);const c=n(278);const a=s(n(87));const u=s(n(622));var l;(function(e){e[e["Success"]=0]="Success";e[e["Failure"]=1]="Failure"})(l=t.ExitCode||(t.ExitCode={}));function exportVariable(e,t){const n=c.toCommandValue(t);process.env[e]=n;const i=process.env["GITHUB_ENV"]||"";if(i){const t="_GitHubActionsFileCommandDelimeter_";const i=`${e}<<${t}${a.EOL}${n}${a.EOL}${t}`;r.issueCommand("ENV",i)}else{o.issueCommand("set-env",{name:e},n)}}t.exportVariable=exportVariable;function setSecret(e){o.issueCommand("add-mask",{},e)}t.setSecret=setSecret;function addPath(e){const t=process.env["GITHUB_PATH"]||"";if(t){r.issueCommand("PATH",e)}else{o.issueCommand("add-path",{},e)}process.env["PATH"]=`${e}${u.delimiter}${process.env["PATH"]}`}t.addPath=addPath;function getInput(e,t){const n=process.env[`INPUT_${e.replace(/ /g,"_").toUpperCase()}`]||"";if(t&&t.required&&!n){throw new Error(`Input required and not supplied: ${e}`)}return n.trim()}t.getInput=getInput;function setOutput(e,t){o.issueCommand("set-output",{name:e},t)}t.setOutput=setOutput;function setCommandEcho(e){o.issue("echo",e?"on":"off")}t.setCommandEcho=setCommandEcho;function setFailed(e){process.exitCode=l.Failure;error(e)}t.setFailed=setFailed;function isDebug(){return process.env["RUNNER_DEBUG"]==="1"}t.isDebug=isDebug;function debug(e){o.issueCommand("debug",{},e)}t.debug=debug;function error(e){o.issue("error",e instanceof Error?e.toString():e)}t.error=error;function warning(e){o.issue("warning",e instanceof Error?e.toString():e)}t.warning=warning;function info(e){process.stdout.write(e+a.EOL)}t.info=info;function startGroup(e){o.issue("group",e)}t.startGroup=startGroup;function endGroup(){o.issue("endgroup")}t.endGroup=endGroup;function group(e,t){return i(this,void 0,void 0,function*(){startGroup(e);let n;try{n=yield t()}finally{endGroup()}return n})}t.group=group;function saveState(e,t){o.issueCommand("save-state",{name:e},t)}t.saveState=saveState;function getState(e){return process.env[`STATE_${e}`]||""}t.getState=getState},717:function(e,t,n){"use strict";var i=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var n in e)if(Object.hasOwnProperty.call(e,n))t[n]=e[n];t["default"]=e;return t};Object.defineProperty(t,"__esModule",{value:true});const s=i(n(747));const o=i(n(87));const r=n(278);function issueCommand(e,t){const n=process.env[`GITHUB_${e}`];if(!n){throw new Error(`Unable to find environment variable for file command ${e}`)}if(!s.existsSync(n)){throw new Error(`Missing file at path: ${n}`)}s.appendFileSync(n,`${r.toCommandValue(t)}${o.EOL}`,{encoding:"utf8"})}t.issueCommand=issueCommand},278:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:true});function toCommandValue(e){if(e===null||e===undefined){return""}else if(typeof e==="string"||e instanceof String){return e}return JSON.stringify(e)}t.toCommandValue=toCommandValue},514:function(e,t,n){"use strict";var i=this&&this.__awaiter||function(e,t,n,i){function adopt(e){return e instanceof n?e:new n(function(t){t(e)})}return new(n||(n=Promise))(function(n,s){function fulfilled(e){try{step(i.next(e))}catch(e){s(e)}}function rejected(e){try{step(i["throw"](e))}catch(e){s(e)}}function step(e){e.done?n(e.value):adopt(e.value).then(fulfilled,rejected)}step((i=i.apply(e,t||[])).next())})};var s=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var n in e)if(Object.hasOwnProperty.call(e,n))t[n]=e[n];t["default"]=e;return t};Object.defineProperty(t,"__esModule",{value:true});const o=s(n(159));function exec(e,t,n){return i(this,void 0,void 0,function*(){const i=o.argStringToArray(e);if(i.length===0){throw new Error(`Parameter 'commandLine' cannot be null or empty.`)}const s=i[0];t=i.slice(1).concat(t||[]);const r=new o.ToolRunner(s,t,n);return r.exec()})}t.exec=exec},159:function(e,t,n){"use strict";var i=this&&this.__awaiter||function(e,t,n,i){function adopt(e){return e instanceof n?e:new n(function(t){t(e)})}return new(n||(n=Promise))(function(n,s){function fulfilled(e){try{step(i.next(e))}catch(e){s(e)}}function rejected(e){try{step(i["throw"](e))}catch(e){s(e)}}function step(e){e.done?n(e.value):adopt(e.value).then(fulfilled,rejected)}step((i=i.apply(e,t||[])).next())})};var s=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var n in e)if(Object.hasOwnProperty.call(e,n))t[n]=e[n];t["default"]=e;return t};Object.defineProperty(t,"__esModule",{value:true});const o=s(n(87));const r=s(n(614));const c=s(n(129));const a=s(n(622));const u=s(n(436));const l=s(n(962));const f=process.platform==="win32";class ToolRunner extends r.EventEmitter{constructor(e,t,n){super();if(!e){throw new Error("Parameter 'toolPath' cannot be null or empty.")}this.toolPath=e;this.args=t||[];this.options=n||{}}_debug(e){if(this.options.listeners&&this.options.listeners.debug){this.options.listeners.debug(e)}}_getCommandString(e,t){const n=this._getSpawnFileName();const i=this._getSpawnArgs(e);let s=t?"":"[command]";if(f){if(this._isCmdFile()){s+=n;for(const e of i){s+=` ${e}`}}else if(e.windowsVerbatimArguments){s+=`"${n}"`;for(const e of i){s+=` ${e}`}}else{s+=this._windowsQuoteCmdArg(n);for(const e of i){s+=` ${this._windowsQuoteCmdArg(e)}`}}}else{s+=n;for(const e of i){s+=` ${e}`}}return s}_processLineBuffer(e,t,n){try{let i=t+e.toString();let s=i.indexOf(o.EOL);while(s>-1){const e=i.substring(0,s);n(e);i=i.substring(s+o.EOL.length);s=i.indexOf(o.EOL)}t=i}catch(e){this._debug(`error processing line. Failed with error ${e}`)}}_getSpawnFileName(){if(f){if(this._isCmdFile()){return process.env["COMSPEC"]||"cmd.exe"}}return this.toolPath}_getSpawnArgs(e){if(f){if(this._isCmdFile()){let t=`/D /S /C "${this._windowsQuoteCmdArg(this.toolPath)}`;for(const n of this.args){t+=" ";t+=e.windowsVerbatimArguments?n:this._windowsQuoteCmdArg(n)}t+='"';return[t]}}return this.args}_endsWith(e,t){return e.endsWith(t)}_isCmdFile(){const e=this.toolPath.toUpperCase();return this._endsWith(e,".CMD")||this._endsWith(e,".BAT")}_windowsQuoteCmdArg(e){if(!this._isCmdFile()){return this._uvQuoteCmdArg(e)}if(!e){return'""'}const t=[" ","\t","&","(",")","[","]","{","}","^","=",";","!","'","+",",","`","~","|","<",">",'"'];let n=false;for(const i of e){if(t.some(e=>e===i)){n=true;break}}if(!n){return e}let i='"';let s=true;for(let t=e.length;t>0;t--){i+=e[t-1];if(s&&e[t-1]==="\\"){i+="\\"}else if(e[t-1]==='"'){s=true;i+='"'}else{s=false}}i+='"';return i.split("").reverse().join("")}_uvQuoteCmdArg(e){if(!e){return'""'}if(!e.includes(" ")&&!e.includes("\t")&&!e.includes('"')){return e}if(!e.includes('"')&&!e.includes("\\")){return`"${e}"`}let t='"';let n=true;for(let i=e.length;i>0;i--){t+=e[i-1];if(n&&e[i-1]==="\\"){t+="\\"}else if(e[i-1]==='"'){n=true;t+="\\"}else{n=false}}t+='"';return t.split("").reverse().join("")}_cloneExecOptions(e){e=e||{};const t={cwd:e.cwd||process.cwd(),env:e.env||process.env,silent:e.silent||false,windowsVerbatimArguments:e.windowsVerbatimArguments||false,failOnStdErr:e.failOnStdErr||false,ignoreReturnCode:e.ignoreReturnCode||false,delay:e.delay||1e4};t.outStream=e.outStream||process.stdout;t.errStream=e.errStream||process.stderr;return t}_getSpawnOptions(e,t){e=e||{};const n={};n.cwd=e.cwd;n.env=e.env;n["windowsVerbatimArguments"]=e.windowsVerbatimArguments||this._isCmdFile();if(e.windowsVerbatimArguments){n.argv0=`"${t}"`}return n}exec(){return i(this,void 0,void 0,function*(){if(!l.isRooted(this.toolPath)&&(this.toolPath.includes("/")||f&&this.toolPath.includes("\\"))){this.toolPath=a.resolve(process.cwd(),this.options.cwd||process.cwd(),this.toolPath)}this.toolPath=yield u.which(this.toolPath,true);return new Promise((e,t)=>{this._debug(`exec tool: ${this.toolPath}`);this._debug("arguments:");for(const e of this.args){this._debug(`   ${e}`)}const n=this._cloneExecOptions(this.options);if(!n.silent&&n.outStream){n.outStream.write(this._getCommandString(n)+o.EOL)}const i=new ExecState(n,this.toolPath);i.on("debug",e=>{this._debug(e)});const s=this._getSpawnFileName();const r=c.spawn(s,this._getSpawnArgs(n),this._getSpawnOptions(this.options,s));const a="";if(r.stdout){r.stdout.on("data",e=>{if(this.options.listeners&&this.options.listeners.stdout){this.options.listeners.stdout(e)}if(!n.silent&&n.outStream){n.outStream.write(e)}this._processLineBuffer(e,a,e=>{if(this.options.listeners&&this.options.listeners.stdline){this.options.listeners.stdline(e)}})})}const u="";if(r.stderr){r.stderr.on("data",e=>{i.processStderr=true;if(this.options.listeners&&this.options.listeners.stderr){this.options.listeners.stderr(e)}if(!n.silent&&n.errStream&&n.outStream){const t=n.failOnStdErr?n.errStream:n.outStream;t.write(e)}this._processLineBuffer(e,u,e=>{if(this.options.listeners&&this.options.listeners.errline){this.options.listeners.errline(e)}})})}r.on("error",e=>{i.processError=e.message;i.processExited=true;i.processClosed=true;i.CheckComplete()});r.on("exit",e=>{i.processExitCode=e;i.processExited=true;this._debug(`Exit code ${e} received from tool '${this.toolPath}'`);i.CheckComplete()});r.on("close",e=>{i.processExitCode=e;i.processExited=true;i.processClosed=true;this._debug(`STDIO streams have closed for tool '${this.toolPath}'`);i.CheckComplete()});i.on("done",(n,i)=>{if(a.length>0){this.emit("stdline",a)}if(u.length>0){this.emit("errline",u)}r.removeAllListeners();if(n){t(n)}else{e(i)}});if(this.options.input){if(!r.stdin){throw new Error("child process missing stdin")}r.stdin.end(this.options.input)}})})}}t.ToolRunner=ToolRunner;function argStringToArray(e){const t=[];let n=false;let i=false;let s="";function append(e){if(i&&e!=='"'){s+="\\"}s+=e;i=false}for(let o=0;o<e.length;o++){const r=e.charAt(o);if(r==='"'){if(!i){n=!n}else{append(r)}continue}if(r==="\\"&&i){append(r);continue}if(r==="\\"&&n){i=true;continue}if(r===" "&&!n){if(s.length>0){t.push(s);s=""}continue}append(r)}if(s.length>0){t.push(s.trim())}return t}t.argStringToArray=argStringToArray;class ExecState extends r.EventEmitter{constructor(e,t){super();this.processClosed=false;this.processError="";this.processExitCode=0;this.processExited=false;this.processStderr=false;this.delay=1e4;this.done=false;this.timeout=null;if(!t){throw new Error("toolPath must not be empty")}this.options=e;this.toolPath=t;if(e.delay){this.delay=e.delay}}CheckComplete(){if(this.done){return}if(this.processClosed){this._setResult()}else if(this.processExited){this.timeout=setTimeout(ExecState.HandleTimeout,this.delay,this)}}_debug(e){this.emit("debug",e)}_setResult(){let e;if(this.processExited){if(this.processError){e=new Error(`There was an error when attempting to execute the process '${this.toolPath}'. This may indicate the process failed to start. Error: ${this.processError}`)}else if(this.processExitCode!==0&&!this.options.ignoreReturnCode){e=new Error(`The process '${this.toolPath}' failed with exit code ${this.processExitCode}`)}else if(this.processStderr&&this.options.failOnStdErr){e=new Error(`The process '${this.toolPath}' failed because one or more lines were written to the STDERR stream`)}}if(this.timeout){clearTimeout(this.timeout);this.timeout=null}this.done=true;this.emit("done",e,this.processExitCode)}static HandleTimeout(e){if(e.done){return}if(!e.processClosed&&e.processExited){const t=`The STDIO streams did not close within ${e.delay/1e3} seconds of the exit event from process '${e.toolPath}'. This may indicate a child process inherited the STDIO streams and has not yet exited.`;e._debug(t)}e._setResult()}}},962:function(e,t,n){"use strict";var i=this&&this.__awaiter||function(e,t,n,i){function adopt(e){return e instanceof n?e:new n(function(t){t(e)})}return new(n||(n=Promise))(function(n,s){function fulfilled(e){try{step(i.next(e))}catch(e){s(e)}}function rejected(e){try{step(i["throw"](e))}catch(e){s(e)}}function step(e){e.done?n(e.value):adopt(e.value).then(fulfilled,rejected)}step((i=i.apply(e,t||[])).next())})};var s;Object.defineProperty(t,"__esModule",{value:true});const o=n(357);const r=n(747);const c=n(622);s=r.promises,t.chmod=s.chmod,t.copyFile=s.copyFile,t.lstat=s.lstat,t.mkdir=s.mkdir,t.readdir=s.readdir,t.readlink=s.readlink,t.rename=s.rename,t.rmdir=s.rmdir,t.stat=s.stat,t.symlink=s.symlink,t.unlink=s.unlink;t.IS_WINDOWS=process.platform==="win32";function exists(e){return i(this,void 0,void 0,function*(){try{yield t.stat(e)}catch(e){if(e.code==="ENOENT"){return false}throw e}return true})}t.exists=exists;function isDirectory(e,n=false){return i(this,void 0,void 0,function*(){const i=n?yield t.stat(e):yield t.lstat(e);return i.isDirectory()})}t.isDirectory=isDirectory;function isRooted(e){e=normalizeSeparators(e);if(!e){throw new Error('isRooted() parameter "p" cannot be empty')}if(t.IS_WINDOWS){return e.startsWith("\\")||/^[A-Z]:/i.test(e)}return e.startsWith("/")}t.isRooted=isRooted;function mkdirP(e,n=1e3,s=1){return i(this,void 0,void 0,function*(){o.ok(e,"a path argument must be provided");e=c.resolve(e);if(s>=n)return t.mkdir(e);try{yield t.mkdir(e);return}catch(i){switch(i.code){case"ENOENT":{yield mkdirP(c.dirname(e),n,s+1);yield t.mkdir(e);return}default:{let n;try{n=yield t.stat(e)}catch(e){throw i}if(!n.isDirectory())throw i}}}})}t.mkdirP=mkdirP;function tryGetExecutablePath(e,n){return i(this,void 0,void 0,function*(){let i=undefined;try{i=yield t.stat(e)}catch(t){if(t.code!=="ENOENT"){console.log(`Unexpected error attempting to determine if executable file exists '${e}': ${t}`)}}if(i&&i.isFile()){if(t.IS_WINDOWS){const t=c.extname(e).toUpperCase();if(n.some(e=>e.toUpperCase()===t)){return e}}else{if(isUnixExecutable(i)){return e}}}const s=e;for(const o of n){e=s+o;i=undefined;try{i=yield t.stat(e)}catch(t){if(t.code!=="ENOENT"){console.log(`Unexpected error attempting to determine if executable file exists '${e}': ${t}`)}}if(i&&i.isFile()){if(t.IS_WINDOWS){try{const n=c.dirname(e);const i=c.basename(e).toUpperCase();for(const s of yield t.readdir(n)){if(i===s.toUpperCase()){e=c.join(n,s);break}}}catch(t){console.log(`Unexpected error attempting to determine the actual case of the file '${e}': ${t}`)}return e}else{if(isUnixExecutable(i)){return e}}}}return""})}t.tryGetExecutablePath=tryGetExecutablePath;function normalizeSeparators(e){e=e||"";if(t.IS_WINDOWS){e=e.replace(/\//g,"\\");return e.replace(/\\\\+/g,"\\")}return e.replace(/\/\/+/g,"/")}function isUnixExecutable(e){return(e.mode&1)>0||(e.mode&8)>0&&e.gid===process.getgid()||(e.mode&64)>0&&e.uid===process.getuid()}},436:function(e,t,n){"use strict";var i=this&&this.__awaiter||function(e,t,n,i){function adopt(e){return e instanceof n?e:new n(function(t){t(e)})}return new(n||(n=Promise))(function(n,s){function fulfilled(e){try{step(i.next(e))}catch(e){s(e)}}function rejected(e){try{step(i["throw"](e))}catch(e){s(e)}}function step(e){e.done?n(e.value):adopt(e.value).then(fulfilled,rejected)}step((i=i.apply(e,t||[])).next())})};Object.defineProperty(t,"__esModule",{value:true});const s=n(129);const o=n(622);const r=n(669);const c=n(962);const a=r.promisify(s.exec);function cp(e,t,n={}){return i(this,void 0,void 0,function*(){const{force:i,recursive:s}=readCopyOptions(n);const r=(yield c.exists(t))?yield c.stat(t):null;if(r&&r.isFile()&&!i){return}const a=r&&r.isDirectory()?o.join(t,o.basename(e)):t;if(!(yield c.exists(e))){throw new Error(`no such file or directory: ${e}`)}const u=yield c.stat(e);if(u.isDirectory()){if(!s){throw new Error(`Failed to copy. ${e} is a directory, but tried to copy without recursive flag.`)}else{yield cpDirRecursive(e,a,0,i)}}else{if(o.relative(e,a)===""){throw new Error(`'${a}' and '${e}' are the same file`)}yield copyFile(e,a,i)}})}t.cp=cp;function mv(e,t,n={}){return i(this,void 0,void 0,function*(){if(yield c.exists(t)){let i=true;if(yield c.isDirectory(t)){t=o.join(t,o.basename(e));i=yield c.exists(t)}if(i){if(n.force==null||n.force){yield rmRF(t)}else{throw new Error("Destination already exists")}}}yield mkdirP(o.dirname(t));yield c.rename(e,t)})}t.mv=mv;function rmRF(e){return i(this,void 0,void 0,function*(){if(c.IS_WINDOWS){try{if(yield c.isDirectory(e,true)){yield a(`rd /s /q "${e}"`)}else{yield a(`del /f /a "${e}"`)}}catch(e){if(e.code!=="ENOENT")throw e}try{yield c.unlink(e)}catch(e){if(e.code!=="ENOENT")throw e}}else{let t=false;try{t=yield c.isDirectory(e)}catch(e){if(e.code!=="ENOENT")throw e;return}if(t){yield a(`rm -rf "${e}"`)}else{yield c.unlink(e)}}})}t.rmRF=rmRF;function mkdirP(e){return i(this,void 0,void 0,function*(){yield c.mkdirP(e)})}t.mkdirP=mkdirP;function which(e,t){return i(this,void 0,void 0,function*(){if(!e){throw new Error("parameter 'tool' is required")}if(t){const t=yield which(e,false);if(!t){if(c.IS_WINDOWS){throw new Error(`Unable to locate executable file: ${e}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also verify the file has a valid extension for an executable file.`)}else{throw new Error(`Unable to locate executable file: ${e}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also check the file mode to verify the file is executable.`)}}}try{const t=[];if(c.IS_WINDOWS&&process.env.PATHEXT){for(const e of process.env.PATHEXT.split(o.delimiter)){if(e){t.push(e)}}}if(c.isRooted(e)){const n=yield c.tryGetExecutablePath(e,t);if(n){return n}return""}if(e.includes("/")||c.IS_WINDOWS&&e.includes("\\")){return""}const n=[];if(process.env.PATH){for(const e of process.env.PATH.split(o.delimiter)){if(e){n.push(e)}}}for(const i of n){const n=yield c.tryGetExecutablePath(i+o.sep+e,t);if(n){return n}}return""}catch(e){throw new Error(`which failed with message ${e.message}`)}})}t.which=which;function readCopyOptions(e){const t=e.force==null?true:e.force;const n=Boolean(e.recursive);return{force:t,recursive:n}}function cpDirRecursive(e,t,n,s){return i(this,void 0,void 0,function*(){if(n>=255)return;n++;yield mkdirP(t);const i=yield c.readdir(e);for(const o of i){const i=`${e}/${o}`;const r=`${t}/${o}`;const a=yield c.lstat(i);if(a.isDirectory()){yield cpDirRecursive(i,r,n,s)}else{yield copyFile(i,r,s)}}yield c.chmod(t,(yield c.stat(e)).mode)})}function copyFile(e,t,n){return i(this,void 0,void 0,function*(){if((yield c.lstat(e)).isSymbolicLink()){try{yield c.lstat(t);yield c.unlink(t)}catch(e){if(e.code==="EPERM"){yield c.chmod(t,"0666");yield c.unlink(t)}}const n=yield c.readlink(e);yield c.symlink(n,t,c.IS_WINDOWS?"junction":null)}else if(!(yield c.exists(t))||n){yield c.copyFile(e,t)}})}},885:e=>{const{hasOwnProperty:t}=Object.prototype;const n=typeof process!=="undefined"&&process.platform==="win32"?"\r\n":"\n";const i=(e,t)=>{const o=[];let r="";if(typeof t==="string"){t={section:t,whitespace:false}}else{t=t||Object.create(null);t.whitespace=t.whitespace===true}const a=t.whitespace?" = ":"=";for(const t of Object.keys(e)){const i=e[t];if(i&&Array.isArray(i)){for(const e of i)r+=c(t+"[]")+a+c(e)+"\n"}else if(i&&typeof i==="object")o.push(t);else r+=c(t)+a+c(i)+n}if(t.section&&r.length)r="["+c(t.section)+"]"+n+r;for(const c of o){const o=s(c).join("\\.");const a=(t.section?t.section+".":"")+o;const{whitespace:u}=t;const l=i(e[c],{section:a,whitespace:u});if(r.length&&l.length)r+=n;r+=l}return r};const s=e=>e.replace(/\1/g,"LITERAL\\1LITERAL").replace(/\\\./g,"").split(/\./).map(e=>e.replace(/\1/g,"\\.").replace(/\2LITERAL\\1LITERAL\2/g,""));const o=e=>{const n=Object.create(null);let i=n;let o=null;const r=/^\[([^\]]*)\]$|^([^=]+)(=(.*))?$/i;const c=e.split(/[\r\n]+/g);for(const e of c){if(!e||e.match(/^\s*[;#]/))continue;const s=e.match(r);if(!s)continue;if(s[1]!==undefined){o=a(s[1]);if(o==="__proto__"){i=Object.create(null);continue}i=n[o]=n[o]||Object.create(null);continue}const c=a(s[2]);const u=c.length>2&&c.slice(-2)==="[]";const l=u?c.slice(0,-2):c;if(l==="__proto__")continue;const f=s[3]?a(s[4]):true;const d=f==="true"||f==="false"||f==="null"?JSON.parse(f):f;if(u){if(!t.call(i,l))i[l]=[];else if(!Array.isArray(i[l]))i[l]=[i[l]]}if(Array.isArray(i[l]))i[l].push(d);else i[l]=d}const u=[];for(const e of Object.keys(n)){if(!t.call(n,e)||typeof n[e]!=="object"||Array.isArray(n[e]))continue;const i=s(e);let o=n;const r=i.pop();const c=r.replace(/\\\./g,".");for(const e of i){if(e==="__proto__")continue;if(!t.call(o,e)||typeof o[e]!=="object")o[e]=Object.create(null);o=o[e]}if(o===n&&c===r)continue;o[c]=n[e];u.push(e)}for(const e of u)delete n[e];return n};const r=e=>e.charAt(0)==='"'&&e.slice(-1)==='"'||e.charAt(0)==="'"&&e.slice(-1)==="'";const c=e=>typeof e!=="string"||e.match(/[=\r\n]/)||e.match(/^\[/)||e.length>1&&r(e)||e!==e.trim()?JSON.stringify(e):e.replace(/;/g,"\\;").replace(/#/g,"\\#");const a=(e,t)=>{e=(e||"").trim();if(r(e)){if(e.charAt(0)==="'")e=e.substr(1,e.length-2);try{e=JSON.parse(e)}catch(e){}}else{let t=false;let n="";for(let i=0,s=e.length;i<s;i++){const s=e.charAt(i);if(t){if("\\;#".indexOf(s)!==-1)n+=s;else n+="\\"+s;t=false}else if(";#".indexOf(s)!==-1)break;else if(s==="\\")t=true;else n+=s}if(t)n+="\\";return n.trim()}return e};e.exports={parse:o,decode:o,stringify:i,encode:i,safe:c,unsafe:a}},69:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:true});t.Outputs=t.Inputs=void 0;var n;(function(e){e["DIGESTFILE"]="digestfile";e["EXTRA_ARGS"]="extra-args";e["IMAGE"]="image";e["PASSWORD"]="password";e["REGISTRY"]="registry";e["TAGS"]="tags";e["TLS_VERIFY"]="tls-verify";e["USERNAME"]="username"})(n=t.Inputs||(t.Inputs={}));var i;(function(e){e["DIGEST"]="digest";e["REGISTRY_PATH"]="registry-path";e["REGISTRY_PATHS"]="registry-paths"})(i=t.Outputs||(t.Outputs={}))},144:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:true});const i=n(186);const s=n(514);const o=n(436);const r=n(747);const c=n(87);const a=n(622);const u=n(629);const l=n(69);let f;let d=false;let h;let p;let m;let g;async function getPodmanPath(){if(f==null){f=await o.which("podman",true);await execute(f,["version"],{group:true})}return f}async function run(){const e="latest";const t=i.getInput(l.Inputs.IMAGE);const n=i.getInput(l.Inputs.TAGS);const s=n.trim().split(/\s+/);if(s.length===0){i.info(`Input "${l.Inputs.TAGS}" is not provided, using default tag "${e}"`);s.push(e)}const o=i.getInput(l.Inputs.REGISTRY);const c=i.getInput(l.Inputs.USERNAME);const a=i.getInput(l.Inputs.PASSWORD);const f=i.getInput(l.Inputs.TLS_VERIFY);const m=i.getInput(l.Inputs.DIGESTFILE);const w=u.isFullImageName(s[0]);if(s.some(e=>u.isFullImageName(e)!==w)){throw new Error(`Input "${l.Inputs.TAGS}" cannot have a mix of full name and non full name tags`)}if(!w){if(!t){throw new Error(`Input "${l.Inputs.IMAGE}" must be provided when using non full name tags`)}if(!o){throw new Error(`Input "${l.Inputs.REGISTRY}" must be provided when using non full name tags`)}const e=o.replace(/\/$/,"");const n=`${e}/${t}`;i.info(`Combining image name "${t}" and registry "${o}" `+`to form registry path "${n}"`);if(t.indexOf("/")>-1&&o.indexOf("/")>-1){i.warning(`"${n}" does not seem to be a valid registry path. `+`The registry path should not contain more than 2 slashes. `+`Refer to the Inputs section of the readme for naming image and registry.`)}h=s.map(e=>u.getFullImageName(t,e));p=s.map(e=>u.getFullImageName(n,e))}else{h=s;p=s}const y=i.getInput(l.Inputs.EXTRA_ARGS);let v=[];if(y){const e=u.splitByNewline(y);v=e.flatMap(e=>e.split(" ")).map(e=>e.trim())}const _=[];const S=await checkImageInPodman();const E=S.foundTags;const b=S.missingTags;if(E.length>0){i.info(`Tag${E.length!==1?"s":""} "${E.join(", ")}" `+`found in Podman image storage`)}if(b.length>0&&E.length>0){i.warning(`Tag${b.length!==1?"s":""} "${b.join(", ")}" `+`not found in Podman image storage`)}const $=await pullImageFromDocker();const x=$.foundTags;const C=$.missingTags;if(x.length>0){i.info(`Tag${x.length!==1?"s":""} "${x.join(", ")}" `+`found in Docker image storage`)}if(C.length>0&&x.length>0){i.warning(`Tag${C.length!==1?"s":""} "${C.join(", ")}" `+`not found in Docker image storage`)}if(b.length>0&&C.length>0){throw new Error(`❌ All tags were not found in either Podman image storage, or Docker image storage. `+`Tag${b.length!==1?"s":""} "${b.join(", ")}" `+`not found in Podman image storage, and tag${C.length!==1?"s":""} `+`"${C.join(", ")}" not found in Docker image storage.`)}const O=E.length===s.length;const T=x.length===s.length;if(O&&T){const e=await isPodmanLocalImageLatest();if(!e){i.warning(`The version of "${h[0]}" in the Docker image storage is more recent `+`than the version in the Podman image storage. The image(s) from the Docker image storage `+`will be pushed.`);d=true}else{i.warning(`The version of "${h[0]}" in the Podman image storage is more recent `+`than the version in the Docker image storage. The image(s) from the Podman image `+`storage will be pushed.`)}}else if(T){i.info(`"${h[0]}" was found in the Docker image storage, but not in the Podman `+`image storage. The image(s) will be pulled into Podman image storage, pushed, and then `+`removed from the Podman image storage.`);d=true}else{i.info(`"${h[0]}" was found in the Podman image storage, but not in the Docker `+`image storage. The image(s) will be pushed from Podman image storage.`)}let A=`⏳ Pushing "${h[0]}" to ${p.join(", ")}`;if(c){A+=` as "${c}"`}i.info(A);let I="";if(c&&!a){i.warning("Username is provided, but password is missing")}else if(!c&&a){i.warning("Password is provided, but username is missing")}else if(c&&a){I=`${c}:${a}`}let D=m;if(!D){D=`${h[0].replace(/[/\\/?%*:|"<>]/g,"-")}_digest.txt`}for(const e of p){const t=[...d?g:[],"push","--quiet","--digestfile",D,d?u.getFullDockerImageName(h[0]):h[0],e];if(v.length>0){t.push(...v)}if(f){t.push(`--tls-verify=${f}`)}if(I){t.push(`--creds=${I}`)}await execute(await getPodmanPath(),t);i.info(`✅ Successfully pushed "${h[0]}" to "${e}"`);_.push(e);try{const e=(await r.promises.readFile(D)).toString();i.info(e);i.setOutput(l.Outputs.DIGEST,e)}catch(e){i.warning(`Failed to read digest file "${D}": ${e}`)}}i.setOutput(l.Outputs.REGISTRY_PATH,_[0]);i.setOutput(l.Outputs.REGISTRY_PATHS,JSON.stringify(_))}async function pullImageFromDocker(){i.info(`🔍 Checking if "${h.join(", ")}" present in the local Docker image storage`);const e=[];const t=[];try{for(const n of h){const i=await execute(await getPodmanPath(),[...g,"pull",`docker-daemon:${n}`],{ignoreReturnCode:true,failOnStdErr:false,group:true});if(i.exitCode===0){e.push(n)}else{t.push(n)}}}catch(e){i.warning(e)}return{foundTags:e,missingTags:t}}async function checkImageInPodman(){i.info(`🔍 Checking if "${h.join(",")}" present in the local Podman image storage`);const e=[];const t=[];try{for(const n of h){const i=await execute(await getPodmanPath(),["image","exists",n],{ignoreReturnCode:true});if(i.exitCode===0){e.push(n)}else{t.push(n)}}}catch(e){i.debug(e)}return{foundTags:e,missingTags:t}}async function isPodmanLocalImageLatest(){const e=h[0];const t=await execute(await getPodmanPath(),["image","inspect",e,"--format","{{.Created}}"]);const n=await execute(await getPodmanPath(),[...g,"image","inspect",u.getFullDockerImageName(e),"--format","{{.Created}}"]);const i=new Date(t.stdout).getTime();const s=new Date(n.stdout).getTime();return i>s}async function createDockerPodmanImageStroage(){i.info(`Creating temporary Podman image storage for pulling from Docker daemon`);m=await r.promises.mkdtemp(a.join(c.tmpdir(),"podman-from-docker-"));g=["--root",m];if(await u.isStorageDriverOverlay()){const e=await u.findFuseOverlayfsPath();if(e){i.info(`Overriding storage mount_program with "fuse-overlayfs" in environment`);g.push("--storage-opt");g.push(`overlay.mount_program=${e}`)}else{i.warning(`"fuse-overlayfs" is not found. Install it before running this action. `+`For more detail see https://github.com/redhat-actions/buildah-build/issues/45`)}}else{i.info("Storage driver is not 'overlay', so not overriding storage configuration")}}async function removeDockerPodmanImageStroage(){if(m){i.info(`Removing temporary Podman image storage for pulling from Docker daemon`);await r.promises.rmdir(m,{recursive:true})}}async function execute(e,t,n={}){let o="";let r="";const c={...n};c.ignoreReturnCode=true;c.listeners={stdline:e=>{o+=`${e}\n`},errline:e=>{r+=`${e}\n`}};if(n.group){const n=[e,...t].join(" ");i.startGroup(n)}try{const u=await s.exec(e,t,c);if(n.ignoreReturnCode!==true&&u!==0){let t=`${a.basename(e)} exited with code ${u}`;if(r){t+=`\n${r}`}throw new Error(t)}return{exitCode:u,stdout:o,stderr:r}}finally{if(n.group){i.endGroup()}}}async function main(){try{await createDockerPodmanImageStroage();await run()}finally{await removeDockerPodmanImageStroage()}}main().catch(e=>{i.setFailed(e.message)})},629:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:true});t.getFullDockerImageName=t.getFullImageName=t.isFullImageName=t.splitByNewline=t.findFuseOverlayfsPath=t.isStorageDriverOverlay=void 0;const i=n(885);const s=n(747);const o=n(186);const r=n(622);const c=n(436);const a=n(87);async function findStorageDriver(e){let t="";for(const n of e){o.debug(`Checking if the storage file exists at ${n}`);if(await fileExists(n)){o.debug(`Storage file exists at ${n}`);const e=i.parse(await s.promises.readFile(n,"utf-8"));if(e.storage.driver){t=e.storage.driver}}}return t}async function isStorageDriverOverlay(){let e=r.join(a.homedir(),".config");if(process.env.XDG_CONFIG_HOME){e=process.env.XDG_CONFIG_HOME}const t=["/etc/containers/storage.conf",r.join(e,"containers/storage.conf")];const n=await findStorageDriver(t);return n==="overlay"}t.isStorageDriverOverlay=isStorageDriverOverlay;async function fileExists(e){try{await s.promises.access(e);return true}catch(e){return false}}async function findFuseOverlayfsPath(){let e;try{e=await c.which("fuse-overlayfs")}catch(e){o.debug(e)}return e}t.findFuseOverlayfsPath=findFuseOverlayfsPath;function splitByNewline(e){return e.split(/\r?\n/)}t.splitByNewline=splitByNewline;function isFullImageName(e){return e.indexOf(":")>0}t.isFullImageName=isFullImageName;function getFullImageName(e,t){if(isFullImageName(t)){return t}return`${e}:${t}`}t.getFullImageName=getFullImageName;const u=`docker.io`;const l=u+`/library`;function getFullDockerImageName(e){switch(e.split("/").length){case 1:return`${l}/${e}`;case 2:return`${u}/${e}`;default:return e}}t.getFullDockerImageName=getFullDockerImageName},357:e=>{"use strict";e.exports=require("assert")},129:e=>{"use strict";e.exports=require("child_process")},614:e=>{"use strict";e.exports=require("events")},747:e=>{"use strict";e.exports=require("fs")},87:e=>{"use strict";e.exports=require("os")},622:e=>{"use strict";e.exports=require("path")},669:e=>{"use strict";e.exports=require("util")}};var t={};function __webpack_require__(n){if(t[n]){return t[n].exports}var i=t[n]={exports:{}};var s=true;try{e[n].call(i.exports,i,i.exports,__webpack_require__);s=false}finally{if(s)delete t[n]}return i.exports}__webpack_require__.ab=__dirname+"/";return __webpack_require__(144)})();
//# sourceMappingURL=index.js.map