import IdeModel from './model_ide';
import SocketModel from './model_socket';
import UtilModel from './model_util';
import SSHModel from './model_ssh';

const Model = {}

Model.ideModel = IdeModel;
Model.socketModel = SocketModel;
Model.utilModel = UtilModel;
Model.sshModel = SSHModel;

export default Model;
