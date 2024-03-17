export type FileTitleDTO = {
    id: string;
    title: string;
    size: number;
};

export enum FileExtension {
    BMP = 'bmp',
    DOC = 'doc',
    DOCX = 'docx',
    JPEG = 'jpeg',
    JPG = 'jpg',
    MSG = 'msg',
    PDF = 'pdf',
    PNG = 'png',
    XLSX = 'xlsx',
}
