import { UserDatabase } from "../database/UsersDatabase";
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager, TokenPayload } from "../services/TokenManager"
import { UserDB, UserModel, USER_ROLES } from "../types"
import { Users } from "../models/Users"
import { HashManager } from "../services/HashManager"
import { UserSignupInputDTO, UserSignupOutputDTO } from "../dtos/userDtos/userSignup.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { LoginInputDTO, LoginOutputDTO } from "../dtos/userDtos/userLogin.dto";
import { NotFoundError } from "../errors/NotFoundError";
import { GetUserInputDTO, GetUserOutputDTO } from "../dtos/userDtos/getUser.dto";
import { EditUserInputDTO, EditUserOutputDTO } from "../dtos/userDtos/editUser.dto";
import { ForbiddenError } from "../errors/ForbiddenError";
import { DeleteUserInputDTO, DeleteUserOutputDTO } from "../dtos/userDtos/deleteUser.dto";

export class UserBusiness {
  constructor(
    private userDatabase: UserDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager,
    private hashManager: HashManager
  ) { }
  public userSignUp = async (input: UserSignupInputDTO): Promise<UserSignupOutputDTO> => {
    const { nickname, email, password, } = input

    const id = this.idGenerator.generate()

    const userDBExists = await this.userDatabase.findUserByEmail(email)
    const userDBNicknameExists = await this.userDatabase.findUserByNickname(nickname)
    const hashedPassword = await this.hashManager.hash(password)

    if (userDBExists) {
      throw new BadRequestError("'email' já cadastrado")
    }

    if (userDBNicknameExists) {
      throw new BadRequestError("'nickname' já cadastrado")
    }

    const user = new Users(
      id,
      nickname,
      email,
      hashedPassword,
      USER_ROLES.NORMAL,
      new Date().toISOString()
    )

    const tokenPayload: TokenPayload = {
      id: user.getId(),
      name: user.getNickname(),
      role: user.getRole()
    }

    const token = this.tokenManager.createToken(tokenPayload)

    const newUser: UserDB = {
      id: user.getId(),
      nickname: user.getNickname(),
      email: user.getEmail(),
      password: user.getPassword(),
      role: user.getRole(),
      created_at: user.getCreatedAt()
    }

    await this.userDatabase.signUp(newUser)

    const output: UserSignupOutputDTO = {
      token: token
    }

    return output
  }

  public login = async (
    input: LoginInputDTO
  ): Promise<LoginOutputDTO> => {
    const { email, password } = input

    const userDB = await this.userDatabase.findUserByEmail(email)

    if (!userDB) {
      throw new NotFoundError("'email' não encontrado")
    }

    const hashedPassword = userDB.password

    const isPasswordCorrect = await this.hashManager.compare(password, hashedPassword)

    if (!isPasswordCorrect) {
      throw new BadRequestError("'email' ou 'password' incorretos")
    }

    const user = new Users(
      userDB.id,
      userDB.nickname,
      userDB.email,
      userDB.password,
      userDB.role,
      userDB.created_at
    )

    const tokenPayload: TokenPayload = {
      id: user.getId(),
      name: user.getNickname(),
      role: user.getRole()
    }

    const token = this.tokenManager.createToken(tokenPayload)

    const output: LoginOutputDTO = {
      token: token
    }

    return output
  }

  public getUsers = async (input: GetUserInputDTO): Promise<GetUserOutputDTO> => {
    const { token } = input

    const payload = this.tokenManager.getPayload(token)

    if (payload === null) {
      throw new BadRequestError("Token inválido")
    }

    const usersModel: UserModel[] = []
    const usersDB = await this.userDatabase.findUsers()

    for (let userDB of usersDB) {

      const user = new Users(
        userDB.id,
        userDB.nickname,
        userDB.email,
        userDB.password,
        userDB.role,
        userDB.created_at
      )

      usersModel.push(user.toUserModel())
    }
    const output: GetUserOutputDTO = usersModel

    return output
  }

  public editUser = async (input: EditUserInputDTO): Promise<EditUserOutputDTO> => {

    const { id, nickname, email, password, token } = input

    const payload = this.tokenManager.getPayload(token)

    if (!payload) {
      throw new BadRequestError("Token inválido")
    }
    const userDB = await this.userDatabase.findUserById(id)

    if (!userDB) {
      throw new NotFoundError("'user' não encontrado")
    }

    if (payload.id !== userDB.id) {
      throw new ForbiddenError("Somente o dono da conta pode edita-la")
    }

    if (email) {
      const userEmailExists: UserDB | undefined = await this.userDatabase.findUserByEmail(email)

      if (userEmailExists) {
        throw new BadRequestError("email já cadastrado")
      }
    }

    if (nickname) {
      const userNicknameExists: UserDB | undefined = await this.userDatabase.findUserByNickname(nickname)

      if (userNicknameExists) {
        throw new BadRequestError("apelido já cadastrado")
      }
    }

    const user = new Users(
      userDB.id, userDB.nickname, userDB.email, userDB.password, userDB.role, userDB.created_at
    )

    nickname && user.setNickname(nickname)
    email && user.setEmail(email)
    password && user.setPassword(password)

    const userEdited: UserDB = {
      id: user.getId(),
      nickname: user.getNickname(),
      email: user.getEmail(),
      password: user.getPassword(),
      role: user.getRole(),
      created_at: user.getCreatedAt(),
    }

    await this.userDatabase.updateUser(userEdited)

    const output: EditUserOutputDTO = undefined

    return output
  }

  public deleteUser = async (input: DeleteUserInputDTO): Promise<DeleteUserOutputDTO> => {
    const { id, token } = input

    const payload = this.tokenManager.getPayload(token)

    if (!payload) {
      throw new BadRequestError("Token inválido")
    }

    const userIdExists = await this.userDatabase.findUserById(id)

    if (!userIdExists) {
      throw new NotFoundError("'id' do usuário não existe")
    }

    if (payload.role !== USER_ROLES.ADMIN) {
      if (payload.id !== userIdExists.id) {
        throw new ForbiddenError("Somente admins e o dono da conta podem deleta-la")
      }
    }
    await this.userDatabase.deleteUser(id)


    const output: DeleteUserOutputDTO = undefined

    return output
  }

}