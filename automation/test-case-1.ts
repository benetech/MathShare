import { By, TestSettings, Until, step } from '@flood/element'

export const settings: TestSettings = {
	waitUntil: 'visible',
}

export default () => {
	step('Start', async browser => {
		await browser.visit('https://mathshare-qa.diagramcenter.org');
		await browser.takeScreenshot();
	})

	step('Click on "Open Mathshare"', async b => {
		const button = await b.findElement(By.attr('a', 'href', '/#/app'));
		await button.click();
		await b.wait(Until.elementIsVisible(By.visibleText('Example Problem Set')));
		await b.takeScreenshot();
	})

	step('Open "New Problem set"', async b => {
		const button = await b.findElement(By.id('add_problem_set'));
		await button.click();
		await b.wait(Until.elementIsVisible(By.visibleText('Select button palettes available for this problem set')));
		await b.takeScreenshot();

		const nextButton = await b.findElement(By.id('BtnSave'));
		await nextButton.click();
		await b.wait(Until.elementIsVisible(By.visibleText('Share Permalink')));
		await b.takeScreenshot();
	});

	step('Open "Add problem modal"', async b => {
		const addNew = await b.findElement(By.xpath("//div[@id='problem-new']/button"))
		await addNew.click();
		await b.wait(Until.elementIsVisible(By.visibleText('Add problem(s) to Problem Set')));

		await b.takeScreenshot();
	});

	step('Add problems', async b => {
		for (let index = 1; index <= 5; index++) {
			await b.type(By.id("mathEditorActive"), `Equation  ${index}`);
			await b.type(By.id("mathAnnotation"), `Title ${index}`);
			
			const addStep = await b.findElement(By.id('addStep'));
			await addStep.click();
		}
		await b.takeScreenshot();
	});

	step('View problem tiles', async b => {
		const doneButton = await b.findElement(By.id('doneButton'));
		await doneButton.click();
		await b.wait(0.5);
		await b.takeScreenshot();
	});

	step('Get share link', async b => {
		const shareBtn = await b.findElement(By.id('shareBtn'))
		await shareBtn.click();
		await b.wait(Until.elementIsVisible(By.visibleText('Copy this link to the problem set and give to your students')));
		await b.takeScreenshot();
	});

	step('Goto Student View', async b => {
		const shareLink = await b.findElement(By.id('shareLink'))
		const link = await shareLink.getAttribute('value');
		await b.evaluate((link) => {
			window.location.assign(`https://${link}`);
			window.location.reload(true); 
		}, link);
		await b.takeScreenshot();
	});

	step('Add solution steps', async b => {
		for (let index = 1; index <= 5; index++) {
			const problemTile = await b.findElement(By.xpath(`//div[@id='problem-${index}']/a`))
			await problemTile.click();
			await b.wait(1);
			await b.type(By.id("mathAnnotation"), `Step ${index}`);
			
			const addStep = await b.findElement(By.id('addStep'))
			await addStep.click();

			const finishBtn = await b.findElement(By.id('finishBtn'));
			await finishBtn.click();
			await b.takeScreenshot();
			await b.wait(Until.elementIsVisible(By.visibleText('Share Permalink')));
		}
		await b.takeScreenshot();
	});

	step('Generate submit link', async b => {
		const shareBtn = await b.findElement(By.id('shareBtn'));
		await shareBtn.click();
		await b.wait(Until.elementIsVisible(By.visibleText('Students visit the link below to access the problem set')));
		await b.takeScreenshot();
	});

	step('Goto Review', async b => {
		const shareLink = await b.findElement(By.id('shareLink'));
		const link = await shareLink.getAttribute('value');
		await b.evaluate((link) => {
			window.location.assign(`https://${link}`);
			window.location.reload(true); 
		}, link);
		await b.wait(2);
		await b.takeScreenshot();
	});
}
