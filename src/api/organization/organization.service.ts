import BadRequestError from '../../error/@types/badRequestError';
import {CreateOrganizationDto} from './dto/request/createOrganization.dto';
import NotFoundError from '../../error/@types/notFoundError';
import Organization from '../organization/organization.model';
import OrganizationDto from './dto/response/organization.dto';
import {Types} from 'mongoose';
import {UpdateOrganizationDto} from './dto/request/updateOrganization.dto';
import User from '../user/user.model';

/**
 * User Services
 */
export default class OrganizationService {
  /**
   * findAllOrganizations
   *
   * @returns List of List Organization DTOs
   */
  public static async findAllOrganizations(): Promise<OrganizationDto[]> {
    const dbOrgs = await Organization.find();
    const orgs: OrganizationDto[] = [];
    dbOrgs.forEach((dbOrg) => {
      orgs.push(new OrganizationDto(dbOrg.id, dbOrg.name));
    });
    return orgs;
  }

  /**
   * findOrganizationById
   *
   * @param id org Id
   * @returns List of List Organization DTOs
   */
  public static async findOrganizationById(id: string): Promise<OrganizationDto> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError('Invalid Organization Id');
    }
    const org = await Organization.findById(id);
    if (!org) {
      throw new NotFoundError('Organization Not Found');
    }
    return new OrganizationDto(org.id, org.name);
  }

  /**
   * updateOrganizationById
   *
   * @param id Organization Id
   * @param updateOrgDto update organization dto
   * @returns List of List Organization DTOs
   */
  public static async updateOrganizationById(id: string, updateOrgDto: UpdateOrganizationDto): Promise<OrganizationDto> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError('Invalid Organization Id');
    }
    let org = await Organization.findById(id);
    if (!org) {
      throw new NotFoundError('Organization Not Found');
    }
    const existingOrg = await Organization.findOne({name: updateOrgDto.name});
    if (existingOrg) {
      throw new BadRequestError('Organization exists with this name');
    }
    updateOrgDto.name ? org.name = updateOrgDto.name : null;
    org = await org.save();
    return new OrganizationDto(org.id, org.name);
  }

  /**
   * deleteOrganizationById
   *
   * @param id Organization Id
   */
  public static async deleteOrganizationById(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError('Invalid Organization Id');
    }
    const org = await Organization.findById(id);
    if (!org) {
      throw new NotFoundError('Organization not Found');
    }
    if ((await User.find({organization: org._id})).length !== 0) {
      throw new BadRequestError('Organization is in use');
    }
    await org.deleteOne();
  }

  /**
   * createOrganization
   *
   * @param orgDto create Organization DTO
   * @returns Created Organization
   */
  public static async createOrganization(orgDto: CreateOrganizationDto): Promise<OrganizationDto> {
    const org = await Organization.findOne({name: orgDto.name});
    if (org) {
      throw new BadRequestError('Organization already exists');
    }
    const newOrg = await Organization.create(orgDto);
    return new OrganizationDto(newOrg.id, newOrg.name);
  }
}
