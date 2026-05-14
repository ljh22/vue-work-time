import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const packageJsonPath = path.join(rootDir, 'package.json');
const manifestJsonPath = path.join(rootDir, 'public', 'manifest.json');
const envPath = path.join(rootDir, '.env');
const envProdPath = path.join(rootDir, '.env.production');

function readJsonFile(filePath) {
	try {
		const content = fs.readFileSync(filePath, 'utf-8');
		return JSON.parse(content);
	} catch (error) {
		console.error(`读取文件失败: ${filePath}`, error);
		process.exit(1);
	}
}

function writeJsonFile(filePath, data) {
	try {
		fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
		console.log(`已更新: ${filePath}`);
	} catch (error) {
		console.error(`写入文件失败: ${filePath}`, error);
		process.exit(1);
	}
}

function readEnvVersion(envFilePath) {
	try {
		const content = fs.readFileSync(envFilePath, 'utf-8');
		const match = content.match(/VITE_APP_VERSION=(\d+\.\d+\.\d+)/);
		if (match) {
			return match[1];
		}
		console.error(`未找到版本号配置: ${envFilePath}`);
		process.exit(1);
	} catch (error) {
		console.error(`读取文件失败: ${envFilePath}`, error);
		process.exit(1);
	}
}

function updateEnvFile(filePath, version) {
	try {
		let content = fs.readFileSync(filePath, 'utf-8');
		const regex = /VITE_APP_VERSION=\d+\.\d+\.\d+/;
		if (regex.test(content)) {
			content = content.replace(regex, `VITE_APP_VERSION=${version}`);
		} else {
			content += `\nVITE_APP_VERSION=${version}\n`;
		}
		fs.writeFileSync(filePath, content);
		console.log(`已更新: ${filePath}`);
	} catch (error) {
		console.error(`写入文件失败: ${filePath}`, error);
		process.exit(1);
	}
}

const version = readEnvVersion(envPath);

const packageJson = readJsonFile(packageJsonPath);
const manifestJson = readJsonFile(manifestJsonPath);

packageJson.version = version;
manifestJson.version = version;

writeJsonFile(packageJsonPath, packageJson);
writeJsonFile(manifestJsonPath, manifestJson);
updateEnvFile(envProdPath, version);

console.log(`版本号同步完成: ${version}`);
