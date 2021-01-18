require('./sourcemap-register.js');module.exports=(()=>{"use strict";var e={351:function(e,t,n){var i=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var n in e)if(Object.hasOwnProperty.call(e,n))t[n]=e[n];t["default"]=e;return t};Object.defineProperty(t,"__esModule",{value:true});const r=i(n(87));const o=n(278);function issueCommand(e,t,n){const i=new Command(e,t,n);process.stdout.write(i.toString()+r.EOL)}t.issueCommand=issueCommand;function issue(e,t=""){issueCommand(e,{},t)}t.issue=issue;const s="::";class Command{constructor(e,t,n){if(!e){e="missing.command"}this.command=e;this.properties=t;this.message=n}toString(){let e=s+this.command;if(this.properties&&Object.keys(this.properties).length>0){e+=" ";let t=true;for(const n in this.properties){if(this.properties.hasOwnProperty(n)){const i=this.properties[n];if(i){if(t){t=false}else{e+=","}e+=`${n}=${escapeProperty(i)}`}}}}e+=`${s}${escapeData(this.message)}`;return e}}function escapeData(e){return o.toCommandValue(e).replace(/%/g,"%25").replace(/\r/g,"%0D").replace(/\n/g,"%0A")}function escapeProperty(e){return o.toCommandValue(e).replace(/%/g,"%25").replace(/\r/g,"%0D").replace(/\n/g,"%0A").replace(/:/g,"%3A").replace(/,/g,"%2C")}},186:function(e,t,n){var i=this&&this.__awaiter||function(e,t,n,i){function adopt(e){return e instanceof n?e:new n(function(t){t(e)})}return new(n||(n=Promise))(function(n,r){function fulfilled(e){try{step(i.next(e))}catch(e){r(e)}}function rejected(e){try{step(i["throw"](e))}catch(e){r(e)}}function step(e){e.done?n(e.value):adopt(e.value).then(fulfilled,rejected)}step((i=i.apply(e,t||[])).next())})};var r=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var n in e)if(Object.hasOwnProperty.call(e,n))t[n]=e[n];t["default"]=e;return t};Object.defineProperty(t,"__esModule",{value:true});const o=n(351);const s=n(717);const c=n(278);const u=r(n(87));const a=r(n(622));var d;(function(e){e[e["Success"]=0]="Success";e[e["Failure"]=1]="Failure"})(d=t.ExitCode||(t.ExitCode={}));function exportVariable(e,t){const n=c.toCommandValue(t);process.env[e]=n;const i=process.env["GITHUB_ENV"]||"";if(i){const t="_GitHubActionsFileCommandDelimeter_";const i=`${e}<<${t}${u.EOL}${n}${u.EOL}${t}`;s.issueCommand("ENV",i)}else{o.issueCommand("set-env",{name:e},n)}}t.exportVariable=exportVariable;function setSecret(e){o.issueCommand("add-mask",{},e)}t.setSecret=setSecret;function addPath(e){const t=process.env["GITHUB_PATH"]||"";if(t){s.issueCommand("PATH",e)}else{o.issueCommand("add-path",{},e)}process.env["PATH"]=`${e}${a.delimiter}${process.env["PATH"]}`}t.addPath=addPath;function getInput(e,t){const n=process.env[`INPUT_${e.replace(/ /g,"_").toUpperCase()}`]||"";if(t&&t.required&&!n){throw new Error(`Input required and not supplied: ${e}`)}return n.trim()}t.getInput=getInput;function setOutput(e,t){o.issueCommand("set-output",{name:e},t)}t.setOutput=setOutput;function setCommandEcho(e){o.issue("echo",e?"on":"off")}t.setCommandEcho=setCommandEcho;function setFailed(e){process.exitCode=d.Failure;error(e)}t.setFailed=setFailed;function isDebug(){return process.env["RUNNER_DEBUG"]==="1"}t.isDebug=isDebug;function debug(e){o.issueCommand("debug",{},e)}t.debug=debug;function error(e){o.issue("error",e instanceof Error?e.toString():e)}t.error=error;function warning(e){o.issue("warning",e instanceof Error?e.toString():e)}t.warning=warning;function info(e){process.stdout.write(e+u.EOL)}t.info=info;function startGroup(e){o.issue("group",e)}t.startGroup=startGroup;function endGroup(){o.issue("endgroup")}t.endGroup=endGroup;function group(e,t){return i(this,void 0,void 0,function*(){startGroup(e);let n;try{n=yield t()}finally{endGroup()}return n})}t.group=group;function saveState(e,t){o.issueCommand("save-state",{name:e},t)}t.saveState=saveState;function getState(e){return process.env[`STATE_${e}`]||""}t.getState=getState},717:function(e,t,n){var i=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var n in e)if(Object.hasOwnProperty.call(e,n))t[n]=e[n];t["default"]=e;return t};Object.defineProperty(t,"__esModule",{value:true});const r=i(n(747));const o=i(n(87));const s=n(278);function issueCommand(e,t){const n=process.env[`GITHUB_${e}`];if(!n){throw new Error(`Unable to find environment variable for file command ${e}`)}if(!r.existsSync(n)){throw new Error(`Missing file at path: ${n}`)}r.appendFileSync(n,`${s.toCommandValue(t)}${o.EOL}`,{encoding:"utf8"})}t.issueCommand=issueCommand},278:(e,t)=>{Object.defineProperty(t,"__esModule",{value:true});function toCommandValue(e){if(e===null||e===undefined){return""}else if(typeof e==="string"||e instanceof String){return e}return JSON.stringify(e)}t.toCommandValue=toCommandValue},514:function(e,t,n){var i=this&&this.__awaiter||function(e,t,n,i){function adopt(e){return e instanceof n?e:new n(function(t){t(e)})}return new(n||(n=Promise))(function(n,r){function fulfilled(e){try{step(i.next(e))}catch(e){r(e)}}function rejected(e){try{step(i["throw"](e))}catch(e){r(e)}}function step(e){e.done?n(e.value):adopt(e.value).then(fulfilled,rejected)}step((i=i.apply(e,t||[])).next())})};var r=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var n in e)if(Object.hasOwnProperty.call(e,n))t[n]=e[n];t["default"]=e;return t};Object.defineProperty(t,"__esModule",{value:true});const o=r(n(159));function exec(e,t,n){return i(this,void 0,void 0,function*(){const i=o.argStringToArray(e);if(i.length===0){throw new Error(`Parameter 'commandLine' cannot be null or empty.`)}const r=i[0];t=i.slice(1).concat(t||[]);const s=new o.ToolRunner(r,t,n);return s.exec()})}t.exec=exec},159:function(e,t,n){var i=this&&this.__awaiter||function(e,t,n,i){function adopt(e){return e instanceof n?e:new n(function(t){t(e)})}return new(n||(n=Promise))(function(n,r){function fulfilled(e){try{step(i.next(e))}catch(e){r(e)}}function rejected(e){try{step(i["throw"](e))}catch(e){r(e)}}function step(e){e.done?n(e.value):adopt(e.value).then(fulfilled,rejected)}step((i=i.apply(e,t||[])).next())})};var r=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var n in e)if(Object.hasOwnProperty.call(e,n))t[n]=e[n];t["default"]=e;return t};Object.defineProperty(t,"__esModule",{value:true});const o=r(n(87));const s=r(n(614));const c=r(n(129));const u=r(n(622));const a=r(n(436));const d=r(n(962));const f=process.platform==="win32";class ToolRunner extends s.EventEmitter{constructor(e,t,n){super();if(!e){throw new Error("Parameter 'toolPath' cannot be null or empty.")}this.toolPath=e;this.args=t||[];this.options=n||{}}_debug(e){if(this.options.listeners&&this.options.listeners.debug){this.options.listeners.debug(e)}}_getCommandString(e,t){const n=this._getSpawnFileName();const i=this._getSpawnArgs(e);let r=t?"":"[command]";if(f){if(this._isCmdFile()){r+=n;for(const e of i){r+=` ${e}`}}else if(e.windowsVerbatimArguments){r+=`"${n}"`;for(const e of i){r+=` ${e}`}}else{r+=this._windowsQuoteCmdArg(n);for(const e of i){r+=` ${this._windowsQuoteCmdArg(e)}`}}}else{r+=n;for(const e of i){r+=` ${e}`}}return r}_processLineBuffer(e,t,n){try{let i=t+e.toString();let r=i.indexOf(o.EOL);while(r>-1){const e=i.substring(0,r);n(e);i=i.substring(r+o.EOL.length);r=i.indexOf(o.EOL)}t=i}catch(e){this._debug(`error processing line. Failed with error ${e}`)}}_getSpawnFileName(){if(f){if(this._isCmdFile()){return process.env["COMSPEC"]||"cmd.exe"}}return this.toolPath}_getSpawnArgs(e){if(f){if(this._isCmdFile()){let t=`/D /S /C "${this._windowsQuoteCmdArg(this.toolPath)}`;for(const n of this.args){t+=" ";t+=e.windowsVerbatimArguments?n:this._windowsQuoteCmdArg(n)}t+='"';return[t]}}return this.args}_endsWith(e,t){return e.endsWith(t)}_isCmdFile(){const e=this.toolPath.toUpperCase();return this._endsWith(e,".CMD")||this._endsWith(e,".BAT")}_windowsQuoteCmdArg(e){if(!this._isCmdFile()){return this._uvQuoteCmdArg(e)}if(!e){return'""'}const t=[" ","\t","&","(",")","[","]","{","}","^","=",";","!","'","+",",","`","~","|","<",">",'"'];let n=false;for(const i of e){if(t.some(e=>e===i)){n=true;break}}if(!n){return e}let i='"';let r=true;for(let t=e.length;t>0;t--){i+=e[t-1];if(r&&e[t-1]==="\\"){i+="\\"}else if(e[t-1]==='"'){r=true;i+='"'}else{r=false}}i+='"';return i.split("").reverse().join("")}_uvQuoteCmdArg(e){if(!e){return'""'}if(!e.includes(" ")&&!e.includes("\t")&&!e.includes('"')){return e}if(!e.includes('"')&&!e.includes("\\")){return`"${e}"`}let t='"';let n=true;for(let i=e.length;i>0;i--){t+=e[i-1];if(n&&e[i-1]==="\\"){t+="\\"}else if(e[i-1]==='"'){n=true;t+="\\"}else{n=false}}t+='"';return t.split("").reverse().join("")}_cloneExecOptions(e){e=e||{};const t={cwd:e.cwd||process.cwd(),env:e.env||process.env,silent:e.silent||false,windowsVerbatimArguments:e.windowsVerbatimArguments||false,failOnStdErr:e.failOnStdErr||false,ignoreReturnCode:e.ignoreReturnCode||false,delay:e.delay||1e4};t.outStream=e.outStream||process.stdout;t.errStream=e.errStream||process.stderr;return t}_getSpawnOptions(e,t){e=e||{};const n={};n.cwd=e.cwd;n.env=e.env;n["windowsVerbatimArguments"]=e.windowsVerbatimArguments||this._isCmdFile();if(e.windowsVerbatimArguments){n.argv0=`"${t}"`}return n}exec(){return i(this,void 0,void 0,function*(){if(!d.isRooted(this.toolPath)&&(this.toolPath.includes("/")||f&&this.toolPath.includes("\\"))){this.toolPath=u.resolve(process.cwd(),this.options.cwd||process.cwd(),this.toolPath)}this.toolPath=yield a.which(this.toolPath,true);return new Promise((e,t)=>{this._debug(`exec tool: ${this.toolPath}`);this._debug("arguments:");for(const e of this.args){this._debug(`   ${e}`)}const n=this._cloneExecOptions(this.options);if(!n.silent&&n.outStream){n.outStream.write(this._getCommandString(n)+o.EOL)}const i=new ExecState(n,this.toolPath);i.on("debug",e=>{this._debug(e)});const r=this._getSpawnFileName();const s=c.spawn(r,this._getSpawnArgs(n),this._getSpawnOptions(this.options,r));const u="";if(s.stdout){s.stdout.on("data",e=>{if(this.options.listeners&&this.options.listeners.stdout){this.options.listeners.stdout(e)}if(!n.silent&&n.outStream){n.outStream.write(e)}this._processLineBuffer(e,u,e=>{if(this.options.listeners&&this.options.listeners.stdline){this.options.listeners.stdline(e)}})})}const a="";if(s.stderr){s.stderr.on("data",e=>{i.processStderr=true;if(this.options.listeners&&this.options.listeners.stderr){this.options.listeners.stderr(e)}if(!n.silent&&n.errStream&&n.outStream){const t=n.failOnStdErr?n.errStream:n.outStream;t.write(e)}this._processLineBuffer(e,a,e=>{if(this.options.listeners&&this.options.listeners.errline){this.options.listeners.errline(e)}})})}s.on("error",e=>{i.processError=e.message;i.processExited=true;i.processClosed=true;i.CheckComplete()});s.on("exit",e=>{i.processExitCode=e;i.processExited=true;this._debug(`Exit code ${e} received from tool '${this.toolPath}'`);i.CheckComplete()});s.on("close",e=>{i.processExitCode=e;i.processExited=true;i.processClosed=true;this._debug(`STDIO streams have closed for tool '${this.toolPath}'`);i.CheckComplete()});i.on("done",(n,i)=>{if(u.length>0){this.emit("stdline",u)}if(a.length>0){this.emit("errline",a)}s.removeAllListeners();if(n){t(n)}else{e(i)}});if(this.options.input){if(!s.stdin){throw new Error("child process missing stdin")}s.stdin.end(this.options.input)}})})}}t.ToolRunner=ToolRunner;function argStringToArray(e){const t=[];let n=false;let i=false;let r="";function append(e){if(i&&e!=='"'){r+="\\"}r+=e;i=false}for(let o=0;o<e.length;o++){const s=e.charAt(o);if(s==='"'){if(!i){n=!n}else{append(s)}continue}if(s==="\\"&&i){append(s);continue}if(s==="\\"&&n){i=true;continue}if(s===" "&&!n){if(r.length>0){t.push(r);r=""}continue}append(s)}if(r.length>0){t.push(r.trim())}return t}t.argStringToArray=argStringToArray;class ExecState extends s.EventEmitter{constructor(e,t){super();this.processClosed=false;this.processError="";this.processExitCode=0;this.processExited=false;this.processStderr=false;this.delay=1e4;this.done=false;this.timeout=null;if(!t){throw new Error("toolPath must not be empty")}this.options=e;this.toolPath=t;if(e.delay){this.delay=e.delay}}CheckComplete(){if(this.done){return}if(this.processClosed){this._setResult()}else if(this.processExited){this.timeout=setTimeout(ExecState.HandleTimeout,this.delay,this)}}_debug(e){this.emit("debug",e)}_setResult(){let e;if(this.processExited){if(this.processError){e=new Error(`There was an error when attempting to execute the process '${this.toolPath}'. This may indicate the process failed to start. Error: ${this.processError}`)}else if(this.processExitCode!==0&&!this.options.ignoreReturnCode){e=new Error(`The process '${this.toolPath}' failed with exit code ${this.processExitCode}`)}else if(this.processStderr&&this.options.failOnStdErr){e=new Error(`The process '${this.toolPath}' failed because one or more lines were written to the STDERR stream`)}}if(this.timeout){clearTimeout(this.timeout);this.timeout=null}this.done=true;this.emit("done",e,this.processExitCode)}static HandleTimeout(e){if(e.done){return}if(!e.processClosed&&e.processExited){const t=`The STDIO streams did not close within ${e.delay/1e3} seconds of the exit event from process '${e.toolPath}'. This may indicate a child process inherited the STDIO streams and has not yet exited.`;e._debug(t)}e._setResult()}}},962:function(e,t,n){var i=this&&this.__awaiter||function(e,t,n,i){function adopt(e){return e instanceof n?e:new n(function(t){t(e)})}return new(n||(n=Promise))(function(n,r){function fulfilled(e){try{step(i.next(e))}catch(e){r(e)}}function rejected(e){try{step(i["throw"](e))}catch(e){r(e)}}function step(e){e.done?n(e.value):adopt(e.value).then(fulfilled,rejected)}step((i=i.apply(e,t||[])).next())})};var r;Object.defineProperty(t,"__esModule",{value:true});const o=n(357);const s=n(747);const c=n(622);r=s.promises,t.chmod=r.chmod,t.copyFile=r.copyFile,t.lstat=r.lstat,t.mkdir=r.mkdir,t.readdir=r.readdir,t.readlink=r.readlink,t.rename=r.rename,t.rmdir=r.rmdir,t.stat=r.stat,t.symlink=r.symlink,t.unlink=r.unlink;t.IS_WINDOWS=process.platform==="win32";function exists(e){return i(this,void 0,void 0,function*(){try{yield t.stat(e)}catch(e){if(e.code==="ENOENT"){return false}throw e}return true})}t.exists=exists;function isDirectory(e,n=false){return i(this,void 0,void 0,function*(){const i=n?yield t.stat(e):yield t.lstat(e);return i.isDirectory()})}t.isDirectory=isDirectory;function isRooted(e){e=normalizeSeparators(e);if(!e){throw new Error('isRooted() parameter "p" cannot be empty')}if(t.IS_WINDOWS){return e.startsWith("\\")||/^[A-Z]:/i.test(e)}return e.startsWith("/")}t.isRooted=isRooted;function mkdirP(e,n=1e3,r=1){return i(this,void 0,void 0,function*(){o.ok(e,"a path argument must be provided");e=c.resolve(e);if(r>=n)return t.mkdir(e);try{yield t.mkdir(e);return}catch(i){switch(i.code){case"ENOENT":{yield mkdirP(c.dirname(e),n,r+1);yield t.mkdir(e);return}default:{let n;try{n=yield t.stat(e)}catch(e){throw i}if(!n.isDirectory())throw i}}}})}t.mkdirP=mkdirP;function tryGetExecutablePath(e,n){return i(this,void 0,void 0,function*(){let i=undefined;try{i=yield t.stat(e)}catch(t){if(t.code!=="ENOENT"){console.log(`Unexpected error attempting to determine if executable file exists '${e}': ${t}`)}}if(i&&i.isFile()){if(t.IS_WINDOWS){const t=c.extname(e).toUpperCase();if(n.some(e=>e.toUpperCase()===t)){return e}}else{if(isUnixExecutable(i)){return e}}}const r=e;for(const o of n){e=r+o;i=undefined;try{i=yield t.stat(e)}catch(t){if(t.code!=="ENOENT"){console.log(`Unexpected error attempting to determine if executable file exists '${e}': ${t}`)}}if(i&&i.isFile()){if(t.IS_WINDOWS){try{const n=c.dirname(e);const i=c.basename(e).toUpperCase();for(const r of yield t.readdir(n)){if(i===r.toUpperCase()){e=c.join(n,r);break}}}catch(t){console.log(`Unexpected error attempting to determine the actual case of the file '${e}': ${t}`)}return e}else{if(isUnixExecutable(i)){return e}}}}return""})}t.tryGetExecutablePath=tryGetExecutablePath;function normalizeSeparators(e){e=e||"";if(t.IS_WINDOWS){e=e.replace(/\//g,"\\");return e.replace(/\\\\+/g,"\\")}return e.replace(/\/\/+/g,"/")}function isUnixExecutable(e){return(e.mode&1)>0||(e.mode&8)>0&&e.gid===process.getgid()||(e.mode&64)>0&&e.uid===process.getuid()}},436:function(e,t,n){var i=this&&this.__awaiter||function(e,t,n,i){function adopt(e){return e instanceof n?e:new n(function(t){t(e)})}return new(n||(n=Promise))(function(n,r){function fulfilled(e){try{step(i.next(e))}catch(e){r(e)}}function rejected(e){try{step(i["throw"](e))}catch(e){r(e)}}function step(e){e.done?n(e.value):adopt(e.value).then(fulfilled,rejected)}step((i=i.apply(e,t||[])).next())})};Object.defineProperty(t,"__esModule",{value:true});const r=n(129);const o=n(622);const s=n(669);const c=n(962);const u=s.promisify(r.exec);function cp(e,t,n={}){return i(this,void 0,void 0,function*(){const{force:i,recursive:r}=readCopyOptions(n);const s=(yield c.exists(t))?yield c.stat(t):null;if(s&&s.isFile()&&!i){return}const u=s&&s.isDirectory()?o.join(t,o.basename(e)):t;if(!(yield c.exists(e))){throw new Error(`no such file or directory: ${e}`)}const a=yield c.stat(e);if(a.isDirectory()){if(!r){throw new Error(`Failed to copy. ${e} is a directory, but tried to copy without recursive flag.`)}else{yield cpDirRecursive(e,u,0,i)}}else{if(o.relative(e,u)===""){throw new Error(`'${u}' and '${e}' are the same file`)}yield copyFile(e,u,i)}})}t.cp=cp;function mv(e,t,n={}){return i(this,void 0,void 0,function*(){if(yield c.exists(t)){let i=true;if(yield c.isDirectory(t)){t=o.join(t,o.basename(e));i=yield c.exists(t)}if(i){if(n.force==null||n.force){yield rmRF(t)}else{throw new Error("Destination already exists")}}}yield mkdirP(o.dirname(t));yield c.rename(e,t)})}t.mv=mv;function rmRF(e){return i(this,void 0,void 0,function*(){if(c.IS_WINDOWS){try{if(yield c.isDirectory(e,true)){yield u(`rd /s /q "${e}"`)}else{yield u(`del /f /a "${e}"`)}}catch(e){if(e.code!=="ENOENT")throw e}try{yield c.unlink(e)}catch(e){if(e.code!=="ENOENT")throw e}}else{let t=false;try{t=yield c.isDirectory(e)}catch(e){if(e.code!=="ENOENT")throw e;return}if(t){yield u(`rm -rf "${e}"`)}else{yield c.unlink(e)}}})}t.rmRF=rmRF;function mkdirP(e){return i(this,void 0,void 0,function*(){yield c.mkdirP(e)})}t.mkdirP=mkdirP;function which(e,t){return i(this,void 0,void 0,function*(){if(!e){throw new Error("parameter 'tool' is required")}if(t){const t=yield which(e,false);if(!t){if(c.IS_WINDOWS){throw new Error(`Unable to locate executable file: ${e}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also verify the file has a valid extension for an executable file.`)}else{throw new Error(`Unable to locate executable file: ${e}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also check the file mode to verify the file is executable.`)}}}try{const t=[];if(c.IS_WINDOWS&&process.env.PATHEXT){for(const e of process.env.PATHEXT.split(o.delimiter)){if(e){t.push(e)}}}if(c.isRooted(e)){const n=yield c.tryGetExecutablePath(e,t);if(n){return n}return""}if(e.includes("/")||c.IS_WINDOWS&&e.includes("\\")){return""}const n=[];if(process.env.PATH){for(const e of process.env.PATH.split(o.delimiter)){if(e){n.push(e)}}}for(const i of n){const n=yield c.tryGetExecutablePath(i+o.sep+e,t);if(n){return n}}return""}catch(e){throw new Error(`which failed with message ${e.message}`)}})}t.which=which;function readCopyOptions(e){const t=e.force==null?true:e.force;const n=Boolean(e.recursive);return{force:t,recursive:n}}function cpDirRecursive(e,t,n,r){return i(this,void 0,void 0,function*(){if(n>=255)return;n++;yield mkdirP(t);const i=yield c.readdir(e);for(const o of i){const i=`${e}/${o}`;const s=`${t}/${o}`;const u=yield c.lstat(i);if(u.isDirectory()){yield cpDirRecursive(i,s,n,r)}else{yield copyFile(i,s,r)}}yield c.chmod(t,(yield c.stat(e)).mode)})}function copyFile(e,t,n){return i(this,void 0,void 0,function*(){if((yield c.lstat(e)).isSymbolicLink()){try{yield c.lstat(t);yield c.unlink(t)}catch(e){if(e.code==="EPERM"){yield c.chmod(t,"0666");yield c.unlink(t)}}const n=yield c.readlink(e);yield c.symlink(n,t,c.IS_WINDOWS?"junction":null)}else if(!(yield c.exists(t))||n){yield c.copyFile(e,t)}})}},144:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:true});const i=n(186);const r=n(514);const o=n(436);const s=n(747);const c=n(622);let u;async function getPodmanPath(){if(u==null){u=await o.which("podman",true)}return u}const a="docker.io/library";async function run(){const e=i.getInput("image",{required:true});const t=i.getInput("tag")||"latest";const n=i.getInput("registry",{required:true});const r=i.getInput("username",{required:true});const o=i.getInput("password",{required:true});const c=i.getInput("tls-verify");const u=i.getInput("digestfile");let d=`${e}:${t}`;const f=await checkImageInPodman(d);const l=await pullImageFromDocker(d);if(!l&&!f){throw new Error(`Image ${d} not found in Podman local storage, or Docker local storage.`)}let p=false;if(f&&l){const e=await isPodmanLocalImageLatest(d);if(!e){i.warning(`The version of ${d} in the Docker image storage is more recent than the version in the Podman image storage. The image from the Docker image storage will be pushed.`);d=`${a}/${d}`;p=true}else{i.warning(`The version of ${d} in the Podman image storage is more recent than the version in the Docker image storage. The image from the Podman image storage will be pushed.`)}}else if(l){d=`${a}/${d}`;i.info(`Image ${d} was found in the Docker image storage, but not in the Podman image storage. The image will be pulled into Podman image storage, pushed, and then removed from the Podman image storage.`);p=true}let h=`Pushing ${d} to ${n}`;if(r){h+=` as ${r}`}i.info(h);const m=n.replace(/\/$/,"");const w=`${m}/${e}:${t}`;const y=`${r}:${o}`;let g=u;if(!g){g=`${d.replace(/[/\\/?%*:|"<>]/g,"-")}_digest.txt`}const _=["push","--quiet","--digestfile",g,"--creds",y,d,w];if(c){_.push(`--tls-verify=${c}`)}await execute(await getPodmanPath(),_);i.info(`Successfully pushed ${d} to ${w}.`);i.setOutput("registry-path",w);if(p){i.info(`Removing ${d} from the Podman image storage`);await execute(await getPodmanPath(),["rmi",d])}try{const e=(await s.promises.readFile(g)).toString();i.info(e);i.setOutput("digest",e)}catch(e){i.warning(`Failed to read digest file "${g}": ${e}`)}}async function pullImageFromDocker(e){try{await execute(await getPodmanPath(),["pull",`docker-daemon:${e}`]);i.info(`Image ${e} found in Docker image storage`);return true}catch(t){i.info(`Image ${e} not found in Docker image storage`);return false}}async function checkImageInPodman(e){i.info("Checking image in Podman image storage");try{await execute(await getPodmanPath(),["image","exists",e]);i.info(`Image ${e} found in Podman image storage`);return true}catch(t){i.info(`Image ${e} not found in Podman image storage`);i.debug(t);return false}}async function isPodmanLocalImageLatest(e){const t=await execute(await getPodmanPath(),["image","inspect",e,"--format","{{.Created}}"]);i.info(`The image from Podman image storage was last modified at ${t.stdout}`);const n=await execute(await getPodmanPath(),["image","inspect",`${a}/${e}`,"--format","{{.Created}}"]);i.info(`The image from Docker image storage was last modified at ${n.stdout}`);const r=new Date(t.stdout).getTime();const o=new Date(n.stdout).getTime();return r>o}async function execute(e,t,n={}){let i="";let o="";const s={...n};s.ignoreReturnCode=true;s.listeners={stdline:e=>{i+=`${e}\n`},errline:e=>{o+=`${e}\n`}};const u=await r.exec(e,t,s);if(n.ignoreReturnCode!==true&&u!==0){let t=`${c.basename(e)} exited with code ${u}`;if(o){t+=`\n${o}`}throw new Error(t)}return{exitCode:u,stdout:i,stderr:o}}run().catch(i.setFailed)},357:e=>{e.exports=require("assert")},129:e=>{e.exports=require("child_process")},614:e=>{e.exports=require("events")},747:e=>{e.exports=require("fs")},87:e=>{e.exports=require("os")},622:e=>{e.exports=require("path")},669:e=>{e.exports=require("util")}};var t={};function __webpack_require__(n){if(t[n]){return t[n].exports}var i=t[n]={exports:{}};var r=true;try{e[n].call(i.exports,i,i.exports,__webpack_require__);r=false}finally{if(r)delete t[n]}return i.exports}__webpack_require__.ab=__dirname+"/";return __webpack_require__(144)})();
//# sourceMappingURL=index.js.map