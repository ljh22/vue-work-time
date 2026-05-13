import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const distDir = path.join(process.cwd(), 'dist');
const outputPath = path.join(process.cwd(), 'dist.zip');

// 使用 PowerShell 压缩（Windows）
const powershell = spawn('powershell', [
	'-Command',
	`Compress-Archive -Path "${distDir}\\*" -DestinationPath "${outputPath}" -Force`
]);

powershell.stdout.on('data', (data) => {
	console.log(data.toString());
});

powershell.stderr.on('data', (data) => {
	console.error(`错误: ${data.toString()}`);
});

powershell.on('close', (code) => {
	if (code === 0) {
		console.log('\n压缩完成！');
	} else {
		console.log(`\n压缩失败，退出码: ${code}`);
		process.exit(code);
	}
});